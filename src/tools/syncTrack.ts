import { Track, SyncStatus } from "../types";
import db from "../data/db";
import blob from "../data/blob";
import automation from "../lib/automation";
import songPage from "../browser/songPage";
import path from "path";

export type SyncResult = {
  slug: string;
  status: 'complete' | 'partial' | 'error';
  fullMix: SyncStatus;
  stems: { slug: string; status: SyncStatus }[];
  mixes: { slug: string; status: SyncStatus }[];
  errors: string[];
};

export async function syncTrack(slug: string): Promise<SyncResult> {
  const result: SyncResult = {
    slug,
    status: 'complete',
    fullMix: 'pending',
    stems: [],
    mixes: [],
    errors: [],
  };

  try {
    const track = await db.tracks.find(slug);
    if (!track) {
      throw new Error(`Track '${slug}' not found in database`);
    }

    const username = track.source.users[0];
    if (!username) {
      throw new Error(`Track '${slug}' has no associated user`);
    }

    const account = await db.accounts.find(username);
    if (!account) {
      throw new Error(`Account '${username}' not found`);
    }

    // Check full mix
    const fullMixBlob = path.join(slug, 'full-mix.mp3');
    const hasFullMix = await blob.checkExists(fullMixBlob);
    result.fullMix = hasFullMix ? 'synced' : 'missing';

    // Check stems
    for (const stem of track.stems || []) {
      const stemBlob = path.join(slug, `${stem.slug}.mp3`);
      const hasStem = await blob.checkExists(stemBlob);
      result.stems.push({
        slug: stem.slug,
        status: hasStem ? 'synced' : 'missing',
      });
    }

    // Check mixes
    for (const mix of track.mixes || []) {
      const mixBlob = path.join(slug, `${mix.slug}.mp3`);
      const hasMix = await blob.checkExists(mixBlob);
      result.mixes.push({
        slug: mix.slug,
        status: hasMix ? 'synced' : 'missing',
      });
    }

    // Count missing items
    const missingCount = 
      (result.fullMix === 'missing' ? 1 : 0) +
      result.stems.filter(s => s.status === 'missing').length +
      result.mixes.filter(m => m.status === 'missing').length;

    if (missingCount === 0) {
      result.status = 'complete';
      await updateTrackSyncStatus(track, result);
      return result;
    }

    // Get browser context and navigate to song page
    const context = await automation.getContext(account.username, account.password);
    const page = songPage(context.page);
    await page.navigate(track.source.url);

    // Download missing full mix
    if (result.fullMix === 'missing') {
      try {
        const stream = await page.getMixStream(undefined);
        await blob.uploadStream(stream, fullMixBlob);
        result.fullMix = 'synced';
      } catch (error) {
        result.fullMix = 'error';
        result.errors.push(`Full mix: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Download missing stems
    for (let i = 0; i < result.stems.length; i++) {
      const stemResult = result.stems[i];
      if (stemResult && stemResult.status === 'missing') {
        const stem = track.stems?.find(s => s.slug === stemResult.slug);
        if (!stem) continue;

        try {
          const stream = await page.getStemStream(stem.order);
          await blob.uploadStream(stream, path.join(slug, `${stem.slug}.mp3`));
          stemResult.status = 'synced';
        } catch (error) {
          stemResult.status = 'error';
          result.errors.push(`Stem ${stem.slug}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    // Download missing mixes
    for (const mixResult of result.mixes) {
      if (mixResult.status === 'missing') {
        const mix = track.mixes?.find(m => m.slug === mixResult.slug);
        if (!mix) continue;

        try {
          const stream = await page.getMixStream(mix.name);
          await blob.uploadStream(stream, path.join(slug, `${mix.slug}.mp3`));
          mixResult.status = 'synced';
        } catch (error) {
          mixResult.status = 'error';
          result.errors.push(`Mix ${mix.slug}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    // Determine overall status
    const hasErrors = result.errors.length > 0;
    const allSynced = 
      result.fullMix === 'synced' &&
      result.stems.every(s => s.status === 'synced') &&
      result.mixes.every(m => m.status === 'synced');

    result.status = allSynced ? 'complete' : hasErrors ? 'error' : 'partial';

    await updateTrackSyncStatus(track, result);

  } catch (error) {
    result.status = 'error';
    result.errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await automation.close();
  }

  return result;
}

async function updateTrackSyncStatus(track: Track, result: SyncResult) {
  const updatedTrack: Track = {
    ...track,
    status: result.status === 'complete' ? 'complete' : result.status === 'error' ? 'error' : 'partial',
    lastSync: new Date(),
    fullMix: track.fullMix ? { ...track.fullMix, status: result.fullMix } : undefined,
    stems: track.stems?.map(stem => {
      const stemResult = result.stems.find(s => s.slug === stem.slug);
      return { ...stem, status: stemResult?.status || 'pending' };
    }),
    mixes: track.mixes?.map(mix => {
      const mixResult = result.mixes.find(m => m.slug === mix.slug);
      return { ...mix, status: mixResult?.status || 'pending' };
    }),
  };

  await db.tracks.update(track.id, track.slug, updatedTrack);
}
