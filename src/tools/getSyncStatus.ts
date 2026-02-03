import { TrackSyncStatus } from "../types";
import db from "../data/db";

export type UserSyncStatus = {
  username: string;
  totalTracks: number;
  complete: number;
  partial: number;
  pending: number;
  error: number;
  percentComplete: number;
  tracks: {
    slug: string;
    artist: string;
    title: string;
    status: TrackSyncStatus;
    totalItems: number;
    syncedItems: number;
  }[];
};

export async function getSyncStatus(username: string): Promise<UserSyncStatus> {
  const tracks = await db.tracks.listByUser(username);

  const result: UserSyncStatus = {
    username,
    totalTracks: tracks.length,
    complete: 0,
    partial: 0,
    pending: 0,
    error: 0,
    percentComplete: 0,
    tracks: [],
  };

  for (const track of tracks) {
    const status = track.status || 'pending';
    
    const totalItems = 1 + (track.stems?.length || 0) + (track.mixes?.length || 0);
    const syncedItems = 
      (track.fullMix?.status === 'synced' ? 1 : 0) +
      (track.stems?.filter(s => s.status === 'synced').length || 0) +
      (track.mixes?.filter(m => m.status === 'synced').length || 0);

    result.tracks.push({
      slug: track.slug,
      artist: track.artist,
      title: track.title,
      status,
      totalItems,
      syncedItems,
    });

    switch (status) {
      case 'complete':
        result.complete++;
        break;
      case 'partial':
        result.partial++;
        break;
      case 'error':
        result.error++;
        break;
      default:
        result.pending++;
    }
  }

  if (result.totalTracks > 0) {
    result.percentComplete = Math.round((result.complete / result.totalTracks) * 100);
  }

  return result;
}
