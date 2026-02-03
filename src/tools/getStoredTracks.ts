import db from "../data/db";

export type TrackSummary = {
  slug: string;
  artist: string;
  title: string;
  status?: string;
  stems: number;
  mixes: number;
};

export async function getStoredTracks(username: string): Promise<TrackSummary[]> {
  const tracks = await db.tracks.listByUser(username);
  return tracks.map(t => ({
    slug: t.slug,
    artist: t.artist,
    title: t.title,
    status: t.status,
    stems: t.stems?.length ?? 0,
    mixes: t.mixes?.length ?? 0,
  }));
}
