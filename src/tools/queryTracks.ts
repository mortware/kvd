import db from '../data/db';
import { Track, TrackImportStatus } from '../types';

type QueryTracksArgs = {
  search?: string;              // Search in slug (contains artist-title, already normalized)
  hasLyrics?: boolean;          // Filter by presence of lyrics field
  status?: TrackImportStatus;   // Filter by import status
  key?: string;                 // Filter by musical key (e.g., "C", "Am", "F#")
  tempoMin?: number;            // Minimum tempo (BPM)
  tempoMax?: number;            // Maximum tempo (BPM)
  username?: string;            // Filter by user who owns the track
  sortBy?: 'artist' | 'title' | 'updated' | 'created'; // Sort field
  sortDirection?: 'asc' | 'desc'; // Sort direction (default: asc)
  limit?: number;               // Max results to return (default: 50, max: 100)
};

type QueryTracksResult = {
  tracks: Track[];
  count: number;
};

/**
 * Query tracks with flexible filtering and sorting
 * 
 * Examples:
 * - Search: { search: "beatles" } (searches slug which contains "beatles-song-title")
 * - Without lyrics: { hasLyrics: false }
 * - With lyrics: { hasLyrics: true }
 * - By status: { status: "complete" }
 * - By key: { key: "C" }
 * - By tempo range: { tempoMin: 100, tempoMax: 140 }
 * - Combined: { search: "love", status: "complete", hasLyrics: true, sortBy: "artist" }
 */
async function queryTracks(args: QueryTracksArgs): Promise<QueryTracksResult> {
  // Enforce max limit
  const limit = args.limit ? Math.min(args.limit, 100) : 50;

  const tracks = await db.tracks.query({
    ...args,
    limit,
  });

  return {
    tracks,
    count: tracks.length,
  };
}

export { queryTracks, type QueryTracksArgs, type QueryTracksResult };
