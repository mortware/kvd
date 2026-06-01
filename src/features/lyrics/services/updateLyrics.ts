import db from '../../../data/db';
import { logInfo, logError } from '../../../lib/logger';

type UpdateLyricsArgs = {
  slug: string;
  lyrics: string | null;
};

type UpdateLyricsResult = {
  slug: string;
  updated: boolean;
  trackFound: boolean;
};

/**
 * Updates the lyrics field for a track in the database
 */
async function updateLyrics({ slug, lyrics }: UpdateLyricsArgs): Promise<UpdateLyricsResult> {
  try {
    const track = await db.tracks.find(slug);

    if (!track) {
      logError('updateLyrics', `Track not found: ${slug}`);
      return {
        slug,
        updated: false,
        trackFound: false,
      };
    }

    track.lyrics = lyrics || undefined;
    track.updated = new Date();

    await db.tracks.update(track.id, track.slug, track);

    logInfo(`Updated lyrics for: ${slug} (${lyrics ? lyrics.length : 0} characters)`);

    return {
      slug,
      updated: true,
      trackFound: true,
    };
  } catch (error) {
    logError('updateLyrics', error);
    throw error;
  }
}

export { updateLyrics, type UpdateLyricsArgs, type UpdateLyricsResult };
