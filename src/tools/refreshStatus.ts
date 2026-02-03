import { Track, SyncStatus } from "../types";
import db from "../data/db";
import blob from "../data/blob";
import path from "path";

export type RefreshResult = {
  tracksProcessed: number;
  tracksUpdated: number;
  errors: string[];
};

/**
 * One-time migration to populate status fields based on actual blob storage.
 * Checks each track's stems/mixes against blob storage and updates DB.
 */
export async function refreshStatus(username: string): Promise<RefreshResult> {
  const tracks = await db.tracks.listByUser(username);
  const result: RefreshResult = {
    tracksProcessed: 0,
    tracksUpdated: 0,
    errors: [],
  };

  for (const track of tracks) {
    try {
      result.tracksProcessed++;
      
      let needsUpdate = false;
      let allSynced = true;
      let anySynced = false;

      // Check full mix
      const fullMixBlob = path.join(track.slug, 'full-mix.mp3');
      const hasFullMix = await blob.checkExists(fullMixBlob);
      const fullMixStatus: SyncStatus = hasFullMix ? 'synced' : 'missing';
      
      if (hasFullMix) anySynced = true;
      else allSynced = false;

      // Check and update stems
      const updatedStems = [];
      for (const stem of track.stems || []) {
        const stemBlob = path.join(track.slug, `${stem.slug}.mp3`);
        const hasStem = await blob.checkExists(stemBlob);
        const stemStatus: SyncStatus = hasStem ? 'synced' : 'missing';
        
        if (hasStem) anySynced = true;
        else allSynced = false;
        
        if (stem.status !== stemStatus) needsUpdate = true;
        updatedStems.push({ ...stem, status: stemStatus });
      }

      // Check and update mixes
      const updatedMixes = [];
      for (const mix of track.mixes || []) {
        const mixBlob = path.join(track.slug, `${mix.slug}.mp3`);
        const hasMix = await blob.checkExists(mixBlob);
        const mixStatus: SyncStatus = hasMix ? 'synced' : 'missing';
        
        if (hasMix) anySynced = true;
        else allSynced = false;
        
        if (mix.status !== mixStatus) needsUpdate = true;
        updatedMixes.push({ ...mix, status: mixStatus });
      }

      // Determine overall track status
      const trackStatus = allSynced ? 'complete' : anySynced ? 'partial' : 'pending';
      
      if (track.status !== trackStatus) needsUpdate = true;
      if (track.fullMix?.status !== fullMixStatus) needsUpdate = true;

      if (needsUpdate) {
        const updatedTrack: Track = {
          ...track,
          status: trackStatus,
          fullMix: track.fullMix ? { ...track.fullMix, status: fullMixStatus } : undefined,
          stems: updatedStems,
          mixes: updatedMixes,
        };

        await db.tracks.update(track.id, track.slug, updatedTrack);
        result.tracksUpdated++;
      }

    } catch (error) {
      const message = `${track.slug}: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(message);
    }
  }

  return result;
}
