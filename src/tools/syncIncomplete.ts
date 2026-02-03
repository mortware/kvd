import db from "../data/db";
import { syncTrack, SyncResult } from "./syncTrack";

export type SyncIncompleteResult = {
  username: string;
  totalIncomplete: number;
  synced: number;
  failed: number;
  results: SyncResult[];
};

/**
 * Syncs all incomplete tracks for a user.
 * Finds tracks where status !== 'complete' and syncs missing files.
 */
export async function syncIncomplete(username: string): Promise<SyncIncompleteResult> {
  const result: SyncIncompleteResult = {
    username,
    totalIncomplete: 0,
    synced: 0,
    failed: 0,
    results: [],
  };

  const account = await db.accounts.find(username);
  if (!account) {
    throw new Error(`Account '${username}' not found`);
  }

  const tracks = await db.tracks.listByUser(username);
  const incomplete = tracks.filter(t => t.status !== 'complete');
  result.totalIncomplete = incomplete.length;

  if (incomplete.length === 0) {
    return result;
  }

  for (const track of incomplete) {
    try {
      const syncResult = await syncTrack(track.slug);
      result.results.push(syncResult);

      if (syncResult.status === 'complete') {
        result.synced++;
      } else {
        result.failed++;
      }
    } catch (error) {
      result.failed++;
      result.results.push({
        slug: track.slug,
        status: 'error',
        fullMix: 'error',
        stems: [],
        mixes: [],
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  return result;
}
