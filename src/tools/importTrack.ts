import { randomUUID } from 'crypto';
import automation from '../lib/automation';
import db from '../data/db';
import songPagePublic from '../browser/songPagePublic';
import { Mix, Stem, Track } from '../types';
import { kvGetPurchases } from './kvGetPurchases';
import { ImportTrackAssetsResult, importTrackAssets } from './importTrackAssets';
import { logWarning } from '../lib/logger';

export type ImportMode = 'import-missing' | 'update' | 'overwrite';

export type ImportTrackArgs = {
  slug: string;
  username?: string;
  skipCache?: boolean;
  mode?: ImportMode;
};

export type ImportTrackResult = {
  ok: true;
  username: string;
  slug: string;
  imported: 'created' | 'updated' | 'unchanged';
  mode: ImportMode;
  importResult: ImportTrackAssetsResult | null;
};

function uniqueUsers(existingUsers: string[] | undefined, username: string): string[] {
  return Array.from(new Set([...(existingUsers ?? []), username]));
}

async function fetchTrackMetadata(username: string, password: string, sourceUrl: string): Promise<Partial<Track>> {
  try {
    const context = await automation.getContext(username, password);
    const page = songPagePublic(context.page);
    await page.navigate(sourceUrl);
    return await page.getMetadata();
  } finally {
    await automation.close();
  }
}

function resolveImportUsername(existing: Track | null, usernameOption: string | undefined): string {
  if (usernameOption && usernameOption.trim() !== '') {
    return usernameOption.trim();
  }

  const inferred = existing?.source?.users?.[0];
  if (inferred) {
    return inferred;
  }

  throw new Error('Unable to infer username for import. Provide --username.');
}

export async function importTrack(args: ImportTrackArgs): Promise<ImportTrackResult> {
  const mode: ImportMode = args.mode ?? 'import-missing';
  const existing = await db.tracks.find(args.slug);
  const username = resolveImportUsername(existing, args.username);

  if (existing && mode === 'import-missing') {
    const currentUsers = existing.source?.users ?? [];
    const hasUser = currentUsers.includes(username);

    if (!hasUser) {
      const updatedTrack: Track = {
        ...existing,
        source: {
          ...existing.source,
          users: uniqueUsers(currentUsers, username),
        },
        updated: new Date(),
      };
      await db.tracks.update(existing.id, existing.slug, updatedTrack);
    }

    if (existing.status === 'complete') {
      return {
        ok: true,
        username,
        slug: args.slug,
        imported: hasUser ? 'unchanged' : 'updated',
        mode,
        importResult: null,
      };
    }

    const importResult = await importTrackAssets(args.slug, { forceOverwrite: false });
    return {
      ok: true,
      username,
      slug: args.slug,
      imported: hasUser ? 'unchanged' : 'updated',
      mode,
      importResult,
    };
  }

  const account = await db.accounts.find(username);
  if (!account) {
    throw new Error(`Account '${username}' not found`);
  }

  const purchases = await kvGetPurchases({
    username,
    skipCache: args.skipCache ?? false,
  });

  const purchasedTrack = purchases.tracks.find((track) => track.slug === args.slug);
  if (!purchasedTrack || !purchasedTrack.source?.url) {
    throw new Error(
      `Track '${args.slug}' was not found in purchases for '${username}'. Use --skip-cache to force refresh.`,
    );
  }

  let metadata: Partial<Track> = {};

  if (!existing) {
    metadata = await fetchTrackMetadata(username, account.password, purchasedTrack.source.url);
  } else if (mode === 'update' || mode === 'overwrite') {
    try {
      metadata = await fetchTrackMetadata(username, account.password, purchasedTrack.source.url);
    } catch (error) {
      // Metadata refresh is helpful, but existing tracks can still be imported from stored metadata.
      const message = error instanceof Error ? error.message : String(error);
      logWarning(`Metadata refresh failed for '${args.slug}'. Continuing with stored metadata. ${message}`);
      metadata = {};
    }
  }

  let imported: 'created' | 'updated' | 'unchanged' = 'unchanged';

  if (!existing) {
    const track: Track = {
      id: randomUUID(),
      artist: purchasedTrack.artist || 'Unknown',
      title: purchasedTrack.title || 'Unknown',
      slug: args.slug,
      source: {
        url: purchasedTrack.source.url,
        users: [username],
        id: purchasedTrack.source.id || '',
      },
      tempo: metadata.tempo || { bpm: 0, variable: false },
      duration: metadata.duration || 'Unknown',
      songKey: metadata.songKey || 'Unknown',
      created: new Date(),
      status: 'pending',
      fullMix: (metadata.fullMix as Mix | undefined) || {
        name: 'Full Mix',
        slug: 'full-mix',
      },
      stems: (metadata.stems as Stem[] | undefined) || [],
      mixes: (metadata.mixes as Mix[] | undefined) || [],
    };

    await db.tracks.create(track);
    imported = 'created';
  } else {
    const users = uniqueUsers(existing.source?.users, username);

    const updatedTrack: Track = mode === 'overwrite'
      ? {
        ...existing,
        artist: purchasedTrack.artist || existing.artist || 'Unknown',
        title: purchasedTrack.title || existing.title || 'Unknown',
        source: {
          ...existing.source,
          url: purchasedTrack.source.url || existing.source.url,
          id: purchasedTrack.source.id || existing.source.id,
          users,
        },
        tempo: metadata.tempo || existing.tempo || { bpm: 0, variable: false },
        duration: metadata.duration || existing.duration || 'Unknown',
        songKey: metadata.songKey || existing.songKey || 'Unknown',
        fullMix:
          (metadata.fullMix as Mix | undefined) ||
          existing.fullMix || {
            name: 'Full Mix',
            slug: 'full-mix',
          },
        stems: (metadata.stems as Stem[] | undefined) || [],
        mixes: (metadata.mixes as Mix[] | undefined) || [],
        status: 'pending',
        lastImport: undefined,
        updated: new Date(),
      }
      : mode === 'update'
        ? {
          ...existing,
          artist: purchasedTrack.artist || existing.artist || 'Unknown',
          title: purchasedTrack.title || existing.title || 'Unknown',
          source: {
            ...existing.source,
            url: purchasedTrack.source.url || existing.source.url,
            id: purchasedTrack.source.id || existing.source.id,
            users,
          },
          tempo: metadata.tempo || existing.tempo || { bpm: 0, variable: false },
          duration: metadata.duration || existing.duration || 'Unknown',
          songKey: metadata.songKey || existing.songKey || 'Unknown',
          fullMix:
            (metadata.fullMix as Mix | undefined) ||
            existing.fullMix || {
              name: 'Full Mix',
              slug: 'full-mix',
            },
          stems: (metadata.stems as Stem[] | undefined) || [],
          mixes: (metadata.mixes as Mix[] | undefined) || [],
          status: 'pending',
          updated: new Date(),
        }
        : {
          ...existing,
          artist: existing.artist || purchasedTrack.artist || 'Unknown',
          title: existing.title || purchasedTrack.title || 'Unknown',
          source: {
            ...existing.source,
            url: existing.source.url || purchasedTrack.source.url,
            id: existing.source.id || purchasedTrack.source.id || '',
            users,
          },
          tempo: existing.tempo || metadata.tempo || { bpm: 0, variable: false },
          duration: existing.duration || metadata.duration || 'Unknown',
          songKey: existing.songKey || metadata.songKey || 'Unknown',
          fullMix: existing.fullMix || (metadata.fullMix as Mix | undefined),
          stems:
            existing.stems && existing.stems.length > 0
              ? existing.stems
              : (metadata.stems as Stem[] | undefined) || [],
          mixes:
            existing.mixes && existing.mixes.length > 0
              ? existing.mixes
              : (metadata.mixes as Mix[] | undefined) || [],
          updated: new Date(),
        };

    await db.tracks.update(existing.id, existing.slug, updatedTrack);
    imported = 'updated';
  }

  const importResult = await importTrackAssets(args.slug, { forceOverwrite: mode === 'overwrite' });

  return {
    ok: true,
    username,
    slug: args.slug,
    imported,
    mode,
    importResult,
  };
}
