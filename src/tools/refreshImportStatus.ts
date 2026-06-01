import { Track, AssetImportStatus } from '../types';
import db from '../data/db';
import blob from '../data/blob';
import path from 'path';

export type RefreshImportStatusResult = {
  tracksProcessed: number;
  tracksUpdated: number;
  errors: string[];
};

export async function refreshImportStatus(username: string): Promise<RefreshImportStatusResult> {
  const tracks = await db.tracks.listByUser(username);
  const result: RefreshImportStatusResult = {
    tracksProcessed: 0,
    tracksUpdated: 0,
    errors: [],
  };

  for (const track of tracks) {
    try {
      result.tracksProcessed += 1;

      let needsUpdate = false;
      let allImported = true;
      let anyImported = false;

      const fullMixBlob = path.join(track.slug, 'full-mix.mp3');
      const hasFullMix = await blob.checkExists(fullMixBlob);
      const fullMixStatus: AssetImportStatus = hasFullMix ? 'imported' : 'missing';

      if (hasFullMix) {
        anyImported = true;
      } else {
        allImported = false;
      }

      const updatedStems = [];
      for (const stem of track.stems || []) {
        const stemBlob = path.join(track.slug, `${stem.slug}.mp3`);
        const hasStem = await blob.checkExists(stemBlob);
        const stemStatus: AssetImportStatus = hasStem ? 'imported' : 'missing';

        if (hasStem) {
          anyImported = true;
        } else {
          allImported = false;
        }

        if (stem.status !== stemStatus) {
          needsUpdate = true;
        }
        updatedStems.push({ ...stem, status: stemStatus });
      }

      const updatedMixes = [];
      for (const mix of track.mixes || []) {
        const mixBlob = path.join(track.slug, `${mix.slug}.mp3`);
        const hasMix = await blob.checkExists(mixBlob);
        const mixStatus: AssetImportStatus = hasMix ? 'imported' : 'missing';

        if (hasMix) {
          anyImported = true;
        } else {
          allImported = false;
        }

        if (mix.status !== mixStatus) {
          needsUpdate = true;
        }
        updatedMixes.push({ ...mix, status: mixStatus });
      }

      const trackStatus = allImported ? 'complete' : anyImported ? 'partial' : 'pending';

      if (track.status !== trackStatus) {
        needsUpdate = true;
      }
      if (track.fullMix?.status !== fullMixStatus) {
        needsUpdate = true;
      }

      if (needsUpdate) {
        const updatedTrack: Track = {
          ...track,
          status: trackStatus,
          fullMix: track.fullMix ? { ...track.fullMix, status: fullMixStatus } : undefined,
          stems: updatedStems,
          mixes: updatedMixes,
        };

        await db.tracks.update(track.id, track.slug, updatedTrack);
        result.tracksUpdated += 1;
      }
    } catch (error) {
      const message = `${track.slug}: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(message);
    }
  }

  return result;
}
