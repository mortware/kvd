import { Command } from 'commander';
import db from '../data/db';
import {
  getImportStatus,
  getStoredTrack,
  getStoredTracks,
  importTrack,
  ImportMode,
  queryTracks,
  refreshImportStatus,
} from '../features';
import { logInfo } from '../lib/logger';
import {
  computeImportItemSummary,
  parseBooleanInput,
  parseImportMode,
  parsePositiveInt,
  parseTrackStatus,
  printJson,
  promptTrackImportMode,
  renderTable,
  resolveUsernameOption,
  summarizeOwners,
} from './shared';
import { registerTrackAudioAliases } from './audio';

async function runTracks(options: { username: string }): Promise<void> {
  const tracks = await getStoredTracks(options.username);

  if (tracks.length === 0) {
    logInfo(`No tracks found for user '${options.username}'.`);
    return;
  }

  console.log(renderTable(tracks, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Artist', width: 24, value: (row) => row.artist },
    { header: 'Title', width: 28, value: (row) => row.title },
    { header: 'Slug', width: 32, value: (row) => row.slug },
    { header: 'Status', width: 10, value: (row) => row.status ?? 'pending' },
    { header: 'Stems', width: 5, align: 'right', value: (row) => `${row.stems}` },
    { header: 'Mixes', width: 5, align: 'right', value: (row) => `${row.mixes}` },
  ]));
}

async function runTrackGet(options: { slug: string }): Promise<void> {
  const result = await getStoredTrack({ slug: options.slug });
  printJson(result);
}

async function runTrackQuery(options: {
  search?: string;
  username?: string;
  status?: string;
  hasLyrics?: string;
  key?: string;
  tempoMin?: number;
  tempoMax?: number;
  sortBy?: 'artist' | 'title' | 'updated' | 'created';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}): Promise<void> {
  if (options.sortBy && !['artist', 'title', 'updated', 'created'].includes(options.sortBy)) {
    throw new Error(`Invalid --sort-by value: ${options.sortBy}`);
  }

  if (options.sortDirection && !['asc', 'desc'].includes(options.sortDirection)) {
    throw new Error(`Invalid --sort-direction value: ${options.sortDirection}`);
  }

  const result = await queryTracks({
    search: options.search,
    username: options.username,
    status: parseTrackStatus(options.status),
    hasLyrics: options.hasLyrics === undefined ? undefined : parseBooleanInput(options.hasLyrics),
    key: options.key,
    tempoMin: options.tempoMin,
    tempoMax: options.tempoMax,
    sortBy: options.sortBy,
    sortDirection: options.sortDirection,
    limit: options.limit,
  });

  if (result.tracks.length === 0) {
    logInfo('No tracks matched the query.');
    return;
  }

  console.log(renderTable(result.tracks, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Artist', width: 24, value: (row) => row.artist },
    { header: 'Title', width: 28, value: (row) => row.title },
    { header: 'Slug', width: 32, value: (row) => row.slug },
    { header: 'Status', width: 9, value: (row) => row.status ?? 'pending' },
    { header: 'Key', width: 5, value: (row) => row.songKey ?? '' },
    {
      header: 'BPM',
      width: 5,
      align: 'right',
      value: (row) => (row.tempo?.bpm !== undefined ? `${row.tempo.bpm}` : ''),
    },
    {
      header: 'Lyrics',
      width: 6,
      value: (row) => (row.lyrics ? 'yes' : 'no'),
    },
  ]));

  logInfo(`Returned ${result.count} track(s).`);
}

async function runTrackImport(options: {
  slug: string;
  username?: string;
  skipCache?: boolean;
  mode?: string;
}): Promise<void> {
  const existing = await db.tracks.find(options.slug);

  console.log('');
  console.log('Track import target:');

  if (existing) {
    const itemSummary = computeImportItemSummary(existing);
    console.log(renderTable([existing], [
      { header: 'Slug', width: 32, value: (row) => row.slug },
      { header: 'Artist', width: 24, value: (row) => row.artist },
      { header: 'Title', width: 28, value: (row) => row.title },
      { header: 'Status', width: 9, value: (row) => row.status ?? 'pending' },
      { header: 'Owners', width: 26, value: (row) => summarizeOwners(row.source?.users) },
      {
        header: 'Items',
        width: 9,
        align: 'right',
        value: () => `${itemSummary.imported}/${itemSummary.total}`,
      },
    ]));

    if ((existing.source?.users ?? []).length > 0) {
      console.log(`Accounts: ${(existing.source.users ?? []).join(', ')}`);
    }
  } else {
    console.log(`- slug: ${options.slug}`);
    console.log('- status: not found in database (will import as new)');
  }

  let username = options.username?.trim();
  if (!username || username === '') {
    if ((existing?.source?.users?.length ?? 0) > 0) {
      username = existing?.source?.users?.[0] ?? '';
      logInfo(`No --username provided. Using first owning account: ${username}`);
    } else {
      username = await resolveUsernameOption(undefined, 'Choose an account number for track import:');
    }
  }

  let mode: ImportMode;
  if (options.mode) {
    mode = parseImportMode(options.mode);
  } else if (process.stdin.isTTY) {
    const selectedMode = await promptTrackImportMode();
    if (!selectedMode) {
      logInfo('Track import cancelled.');
      return;
    }
    mode = selectedMode;
  } else {
    mode = 'import-missing';
    logInfo('No --mode provided in non-interactive context. Defaulting to import-missing.');
  }

  logInfo(`Importing track '${options.slug}' with mode '${mode}' as account '${username}'.`);

  const result = await importTrack({
    slug: options.slug,
    username,
    skipCache: options.skipCache,
    mode,
  });

  printJson(result);
}

async function runTrackImportStatus(options: { username: string; details?: boolean }): Promise<void> {
  const result = await getImportStatus(options.username);

  console.log(
    `Import status for ${result.username}: ` +
    `${result.complete}/${result.totalTracks} complete (${result.percentComplete}%) | ` +
    `partial: ${result.partial}, pending: ${result.pending}, error: ${result.error}`,
  );

  if (options.details && result.tracks.length > 0) {
    console.log('');
    console.log(renderTable(result.tracks, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Artist', width: 24, value: (row) => row.artist },
      { header: 'Title', width: 28, value: (row) => row.title },
      { header: 'Slug', width: 32, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Imported', width: 8, align: 'right', value: (row) => `${row.importedItems}` },
      { header: 'Total', width: 8, align: 'right', value: (row) => `${row.totalItems}` },
    ]));
  }
}

async function runTrackRefreshImportStatus(options: { username: string }): Promise<void> {
  const result = await refreshImportStatus(options.username);
  printJson(result);
}

export function registerTrackCommands(program: Command): void {
  const track = program.command('track').description('Track listing, query, import, and local audio operations');

  track
    .command('list')
    .description('List stored tracks for one account')
    .requiredOption('--username <name>', 'Account username')
    .action(async (options: { username: string }) => {
      await runTracks(options);
    });

  track
    .command('get')
    .description('Get a single stored track by slug')
    .requiredOption('--slug <slug>', 'Track slug')
    .action(async (options: { slug: string }) => {
      await runTrackGet(options);
    });

  track
    .command('query')
    .description('Query tracks with filters for search, import status, lyrics, key, tempo, and sorting')
    .option('--search <text>', 'Search in slug')
    .option('--username <name>', 'Filter by owning user')
    .option('--status <status>', 'pending | partial | complete | error')
    .option('--has-lyrics <bool>', 'true | false')
    .option('--key <key>', 'Musical key (e.g. C, Am, F#)')
    .option('--tempo-min <n>', 'Minimum BPM', parsePositiveInt)
    .option('--tempo-max <n>', 'Maximum BPM', parsePositiveInt)
    .option('--sort-by <field>', 'artist | title | updated | created')
    .option('--sort-direction <dir>', 'asc | desc')
    .option('--limit <n>', 'Max results (default: 50, max: 100)', parsePositiveInt)
    .action(async (options: {
      search?: string;
      username?: string;
      status?: string;
      hasLyrics?: string;
      key?: string;
      tempoMin?: number;
      tempoMax?: number;
      sortBy?: 'artist' | 'title' | 'updated' | 'created';
      sortDirection?: 'asc' | 'desc';
      limit?: number;
    }) => {
      await runTrackQuery(options);
    });

  track
    .command('import')
    .description('Import one track metadata and assets from karaoke-version')
    .requiredOption('--slug <slug>', 'Track slug')
    .option('--username <name>', 'Account username (optional if slug already exists in DB)')
    .option('--skip-cache', 'Force refresh purchases before import', false)
    .option('--mode <mode>', 'import-missing | update | overwrite')
    .action(async (options: {
      slug: string;
      username?: string;
      skipCache?: boolean;
      mode?: string;
    }) => {
      await runTrackImport(options);
    });

  track
    .command('import-status')
    .description('Show import completion summary for a user')
    .requiredOption('--username <name>', 'Account username')
    .option('--details', 'Show per-track rows', false)
    .action(async (options: { username: string; details?: boolean }) => {
      await runTrackImportStatus(options);
    });

  track
    .command('refresh-status')
    .description('Recalculate track import statuses by checking blob existence')
    .requiredOption('--username <name>', 'Account username')
    .action(async (options: { username: string }) => {
      await runTrackRefreshImportStatus(options);
    });

  registerTrackAudioAliases(track);
}
