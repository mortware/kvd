import { TrackImportStatus } from '../../../types';
import db from '../../../data/db';

function isImportedAssetStatus(status: string | undefined): boolean {
  return status === 'imported' || status === 'synced';
}

export type UserImportStatus = {
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
    status: TrackImportStatus;
    totalItems: number;
    importedItems: number;
  }[];
};

export async function getImportStatus(username: string): Promise<UserImportStatus> {
  const tracks = await db.tracks.listByUser(username);

  const result: UserImportStatus = {
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
    const importedItems =
      (isImportedAssetStatus(track.fullMix?.status) ? 1 : 0) +
      (track.stems?.filter((s) => isImportedAssetStatus(s.status)).length || 0) +
      (track.mixes?.filter((m) => isImportedAssetStatus(m.status)).length || 0);

    result.tracks.push({
      slug: track.slug,
      artist: track.artist,
      title: track.title,
      status,
      totalItems,
      importedItems,
    });

    switch (status) {
      case 'complete':
        result.complete += 1;
        break;
      case 'partial':
        result.partial += 1;
        break;
      case 'error':
        result.error += 1;
        break;
      default:
        result.pending += 1;
    }
  }

  if (result.totalTracks > 0) {
    result.percentComplete = Math.round((result.complete / result.totalTracks) * 100);
  }

  return result;
}
