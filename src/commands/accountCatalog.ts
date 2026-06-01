import { Command } from 'commander';
import db from '../data/db';
import { compareCatalog, createAccount, importTrack, kvGetPurchases, listAccounts } from '../features';
import { Track, TrackImportStatus } from '../types';
import { logInfo } from '../lib/logger';
import {
  CatalogImportActionMode,
  normalizeCatalogImportActionMode,
  parseImportMode,
  printJson,
  promptCatalogImportAction,
  renderTable,
  resolveUsernameOption,
} from './shared';

type NeedsImportRow = {
  sourceId: string;
  slug: string;
  artist: string;
  title: string;
  status: 'pending' | 'partial' | 'error';
};

type SharedTrackRow = {
  sourceId: string;
  slug: string;
  artist: string;
  title: string;
  users: string;
  status: 'pending' | 'partial' | 'complete' | 'error';
};

type SharedTrackClaimCandidate = {
  track: Track;
  sourceId: string;
};

async function runAccountList(): Promise<void> {
  const accounts = await listAccounts();

  if (accounts.length === 0) {
    logInfo('No accounts found.');
    return;
  }

  console.log(renderTable(accounts, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Username', width: 24, value: (row) => row.username },
    { header: 'Name', width: 28, value: (row) => row.name ?? '' },
  ]));
}

async function runAccountCreate(options: { username: string; password: string; name?: string }): Promise<void> {
  const result = await createAccount({
    username: options.username,
    password: options.password,
    name: options.name,
  });
  printJson(result);
}

async function runPurchases(options: { username: string; skipCache?: boolean }): Promise<void> {
  const result = await kvGetPurchases({ username: options.username, skipCache: options.skipCache ?? false });
  console.log(result.cached
    ? `Using cached catalog from ${result.fetchedAt.toISOString()}`
    : `Fetched fresh catalog at ${result.fetchedAt.toISOString()}`,
  );
  printJson({
    trackCount: result.tracks.length,
    cached: result.cached,
    cacheAgeHours: result.cacheAgeHours,
    fetchedAt: result.fetchedAt,
    tracks: result.tracks,
  });
}

async function runCompareCatalog(options: {
  username?: string;
  useCache?: boolean;
  refresh?: boolean;
  action?: string;
  claimShared?: boolean;
}): Promise<void> {
  const username = await resolveUsernameOption(options.username, 'Choose an account number for account import:');
  const skipCache = options.useCache ? false : true;
  const comparison = await compareCatalog(username, { skipCache: options.refresh ? true : skipCache });

  const dbTracks = await db.tracks.listByUser(username);
  const dbBySourceId = new Map(dbTracks.map((track) => [String(track.source.id), track]));
  const allDbTracks = await db.tracks.list();
  const globalDbBySourceId = new Map(allDbTracks.map((track) => [String(track.source.id), track]));
  const sharedTrackClaimCandidates: SharedTrackClaimCandidate[] = [];

  let sharedTracks: SharedTrackRow[] = comparison.onlyOnWebsite
    .map((item) => {
      const dbTrack = globalDbBySourceId.get(String(item.sourceId));
      if (!dbTrack || dbBySourceId.has(String(item.sourceId))) {
        return null;
      }

      sharedTrackClaimCandidates.push({
        track: dbTrack,
        sourceId: String(item.sourceId),
      });

      return {
        sourceId: String(item.sourceId),
        slug: dbTrack.slug,
        artist: dbTrack.artist,
        title: dbTrack.title,
        users: (dbTrack.source.users || []).join(', '),
        status: dbTrack.status ?? 'pending',
      };
    })
    .filter((item): item is SharedTrackRow => Boolean(item));

  if (options.claimShared && sharedTrackClaimCandidates.length > 0) {
    let claimedCount = 0;

    for (const candidate of sharedTrackClaimCandidates) {
      const existingUsers = candidate.track.source?.users ?? [];
      if (existingUsers.includes(username)) {
        continue;
      }

      const updatedTrack: Track = {
        ...candidate.track,
        source: {
          ...candidate.track.source,
          users: [...existingUsers, username],
        },
        updated: new Date(),
      };

      await db.tracks.update(candidate.track.id, candidate.track.slug, updatedTrack);
      dbBySourceId.set(candidate.sourceId, updatedTrack);
      globalDbBySourceId.set(candidate.sourceId, updatedTrack);
      claimedCount += 1;
    }

    if (claimedCount > 0) {
      logInfo(`Claimed ${claimedCount} shared track(s) for account '${username}'.`);
    }
  }

  sharedTracks = comparison.onlyOnWebsite
    .map((item) => {
      const dbTrack = globalDbBySourceId.get(String(item.sourceId));
      if (!dbTrack || dbBySourceId.has(String(item.sourceId))) {
        return null;
      }

      return {
        sourceId: String(item.sourceId),
        slug: dbTrack.slug,
        artist: dbTrack.artist,
        title: dbTrack.title,
        users: (dbTrack.source.users || []).join(', '),
        status: dbTrack.status ?? 'pending',
      };
    })
    .filter((item): item is SharedTrackRow => Boolean(item));

  const notImported = comparison.onlyOnWebsite.filter((item) => !globalDbBySourceId.has(String(item.sourceId)));

  const needsImport: NeedsImportRow[] = [];
  const importableMatches = [
    ...comparison.inBoth.map((item) => ({ sourceId: String(item.sourceId), kind: 'owned' as const })),
    ...sharedTracks.map((item) => ({ sourceId: String(item.sourceId), kind: 'shared' as const })),
  ];

  for (const match of importableMatches) {
    const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
    if (!dbTrack) {
      continue;
    }

    const status = dbTrack.status ?? 'pending';
    if (status === 'complete') {
      continue;
    }

    needsImport.push({
      sourceId: match.sourceId,
      slug: dbTrack.slug,
      artist: dbTrack.artist,
      title: dbTrack.title,
      status,
    });
  }

  const completeRows = importableMatches.filter((match) => {
    const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
    return (dbTrack?.status ?? 'pending') === 'complete';
  });

  const totalCatalogTracks = comparison.inBoth.length + sharedTracks.length + notImported.length;
  const totalNeedsImport = totalCatalogTracks - completeRows.length;

  console.log('');
  console.log(`Catalog import validation for '${username}'${(options.refresh || !options.useCache) ? ' (fresh website fetch)' : ' (cache allowed)'}:`);
  console.log(renderTable([
    {
      totalCatalogTracks,
      completeTracks: completeRows.length,
      needsImportTracks: totalNeedsImport,
    },
  ], [
    { header: 'Catalog Total', width: 13, align: 'right', value: (row) => `${row.totalCatalogTracks}` },
    { header: 'Complete', width: 8, align: 'right', value: (row) => `${row.completeTracks}` },
    { header: 'Needs Import', width: 12, align: 'right', value: (row) => `${row.needsImportTracks}` },
  ]));

  console.log('');
  console.log(`On website and in DB: ${comparison.inBoth.length + sharedTracks.length}`);
  console.log(`In DB but owned by other accounts: ${sharedTracks.length}`);
  console.log(`On website only (not imported): ${notImported.length}`);
  console.log(`In DB only: ${comparison.onlyInDatabase.length}`);
  console.log(`In DB but not fully imported: ${needsImport.length}`);

  if (sharedTracks.length > 0) {
    console.log('');
    console.log('Tracks already in DB but linked to other accounts:');
    console.log(renderTable(sharedTracks, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Users', width: 28, value: (row) => row.users || '-' },
    ]));
  }

  if (needsImport.length > 0) {
    console.log('');
    console.log('Tracks not fully imported (import candidates):');
    console.log(renderTable(needsImport, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Artist', width: 22, value: (row) => row.artist },
      { header: 'Title', width: 24, value: (row) => row.title },
    ]));
  }

  if (notImported.length > 0) {
    console.log('');
    console.log('Tracks on website but not imported into DB:');
    console.log(renderTable(notImported, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Artist', width: 22, value: (row) => row.artist },
      { header: 'Title', width: 24, value: (row) => row.title },
    ]));
  }

  const requestedAction = normalizeCatalogImportActionMode(options.action);
  let actionMode: CatalogImportActionMode = requestedAction;

  if (requestedAction === 'prompt') {
    actionMode = process.stdin.isTTY ? await promptCatalogImportAction() : 'none';
  }

  if (actionMode === 'none') {
    return;
  }

  const importCandidates = actionMode === 'update' || actionMode === 'overwrite'
    ? importableMatches
      .map((match) => {
        const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
        if (!dbTrack) {
          return null;
        }

        return {
          slug: dbTrack.slug,
          status: dbTrack.status ?? 'pending',
        };
      })
      .filter((item): item is { slug: string; status: TrackImportStatus | 'pending' } => Boolean(item))
    : needsImport.map((item) => ({ slug: item.slug, status: item.status }));

  if (importCandidates.length === 0) {
    logInfo(actionMode === 'import-missing' ? 'No missing tracks found to import.' : 'No comparable DB tracks found to import.');
    return;
  }

  const importResults: Array<{ slug: string; beforeStatus: string; afterStatus: string; errors?: string[] }> = [];

  for (const candidate of importCandidates) {
    logInfo(`Importing: ${candidate.slug}`);
    try {
      const result = await importTrack({
        slug: candidate.slug,
        username,
        mode: parseImportMode(actionMode),
      });
      importResults.push({
        slug: candidate.slug,
        beforeStatus: candidate.status,
        afterStatus: result.importResult?.status ?? 'skipped',
        errors: result.importResult?.errors.length ? result.importResult.errors : undefined,
      });
    } catch (error) {
      importResults.push({
        slug: candidate.slug,
        beforeStatus: candidate.status,
        afterStatus: 'error',
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  const complete = importResults.filter((item) => item.afterStatus === 'complete').length;
  const failed = importResults.length - complete;

  console.log('');
  console.log(`Import summary (${actionMode}):`);
  printJson({
    selected: importResults.length,
    complete,
    failed,
    results: importResults,
  });
}

export function registerAccountCatalogCommands(program: Command): void {
  const account = program.command('account').description('Account operations');

  account
    .command('list')
    .description('List all stored karaoke-version accounts')
    .action(async () => {
      await runAccountList();
    });

  account
    .command('create')
    .description('Create a karaoke-version account entry in CosmosDB')
    .requiredOption('--username <name>', 'Account username')
    .requiredOption('--password <password>', 'Account password')
    .option('--name <displayName>', 'Optional display name')
    .action(async (options: { username: string; password: string; name?: string }) => {
      await runAccountCreate(options);
    });

  account
    .command('import')
    .description('Validate account catalog and optionally import missing tracks')
    .option('--username <name>', 'Account username')
    .option('--use-cache', 'Allow cached website catalog (default: fetch fresh)', false)
    .option('--refresh', 'Force fresh website catalog fetch (same as default)', false)
    .option('--claim-shared', 'Add this username to tracks already present in DB under other accounts', false)
    .option('--action <mode>', 'prompt | import-missing | update | overwrite | none', 'prompt')
    .action(async (options: {
      username?: string;
      useCache?: boolean;
      refresh?: boolean;
      action?: string;
      claimShared?: boolean;
    }) => {
      await runCompareCatalog(options);
    });

  const catalog = program.command('catalog').description('Catalog and source website operations');

  catalog
    .command('purchases')
    .description('Fetch purchased tracks from karaoke-version (supports account catalog cache)')
    .requiredOption('--username <name>', 'Account username')
    .option('--skip-cache', 'Force refresh from website', false)
    .action(async (options: { username: string; skipCache?: boolean }) => {
      await runPurchases(options);
    });
}
