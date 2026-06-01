export type LyricsFetchArgs = {
  slug: string;
  sourceUrl: string;
};

export type LyricsFetchResult = {
  lyrics: string | null;
  found: boolean;
};

export interface LyricsSource {
  sourceName: string;
  fetchLyrics(args: LyricsFetchArgs): Promise<LyricsFetchResult>;
}
