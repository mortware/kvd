import { getPurchases } from "./getPurchases";
import db from "../data/db";

export type CatalogComparison = {
  inBoth: { sourceId: string; slug: string; artist: string; title: string }[];
  onlyOnWebsite: { sourceId: string; slug: string; artist: string; title: string }[];
  onlyInDatabase: { sourceId: string; slug: string; artist: string; title: string }[];
};

export async function compareCatalog(username: string): Promise<CatalogComparison> {
  const result = await getPurchases({ username });
  const websiteTracks = result.tracks;
  const websiteIds = new Set(websiteTracks.map(t => t.source?.id).filter(Boolean));

  const dbTracks = await db.tracks.listByUser(username);
  const dbIds = new Set(dbTracks.map(t => t.source?.id).filter(Boolean));

  const inBoth: CatalogComparison['inBoth'] = [];
  const onlyOnWebsite: CatalogComparison['onlyOnWebsite'] = [];
  const onlyInDatabase: CatalogComparison['onlyInDatabase'] = [];

  for (const track of websiteTracks) {
    const sourceId = track.source?.id;
    if (!sourceId) continue;
    
    if (dbIds.has(sourceId)) {
      inBoth.push({
        sourceId,
        slug: track.slug || '',
        artist: track.artist || '',
        title: track.title || '',
      });
    } else {
      onlyOnWebsite.push({
        sourceId,
        slug: track.slug || '',
        artist: track.artist || '',
        title: track.title || '',
      });
    }
  }

  for (const track of dbTracks) {
    const sourceId = track.source?.id;
    if (!sourceId) continue;
    
    if (!websiteIds.has(sourceId)) {
      onlyInDatabase.push({
        sourceId,
        slug: track.slug,
        artist: track.artist,
        title: track.title,
      });
    }
  }

  return { inBoth, onlyOnWebsite, onlyInDatabase };
}
