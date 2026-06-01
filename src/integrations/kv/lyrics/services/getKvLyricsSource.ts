import { LyricsSource } from '../../../../features/lyrics/sources/LyricsSource';
import { fetchKvLyrics } from './fetchKvLyrics';

export function getKvLyricsSource(): LyricsSource {
  return {
    sourceName: 'karaoke-version',
    fetchLyrics: fetchKvLyrics,
  };
}
