import db from '../data/db';
import { Track } from '../types';

type GetStoredTrackArgs = {
  slug: string;
};

type GetStoredTrackResult = {
  track: Track | null;
  found: boolean;
};

/**
 * Gets a single track from the database by slug
 */
async function getStoredTrack({ slug }: GetStoredTrackArgs): Promise<GetStoredTrackResult> {
  const track = await db.tracks.find(slug);

  return {
    track,
    found: !!track,
  };
}

export { getStoredTrack, type GetStoredTrackArgs, type GetStoredTrackResult };
