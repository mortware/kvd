import db from '../../../data/db';
import { LyricsSource } from '../sources/LyricsSource';

export type GetLyricsArgs = {
  slug: string;
  source: LyricsSource;
};

export type GetLyricsResult = {
  slug: string;
  lyrics: string | null;
  found: boolean;
  source: string;
};

export async function getLyrics({ slug, source }: GetLyricsArgs): Promise<GetLyricsResult> {
  const track = await db.tracks.find(slug);

  if (!track || !track.source?.url) {
    throw new Error(`Track '${slug}' not found in database or missing source URL`);
  }

  const fetched = await source.fetchLyrics({
    slug,
    sourceUrl: track.source.url,
  });

  return {
    slug,
    lyrics: fetched.lyrics,
    found: fetched.found,
    source: source.sourceName,
  };
}
