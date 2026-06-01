import { chromium } from 'playwright';
import { logDebug, logInfo, logError } from '../lib/logger';
import { KaraokeVersionConfig } from '../consts';
import { urlJoin } from '../lib/utils';

type KvGetLyricsArgs = {
  slug: string;
};

type KvGetLyricsResult = {
  slug: string;
  lyrics: string | null;
  found: boolean;
};

/**
 * Gets lyrics for a track from karaoke-version.com
 * This is an anonymous call - no authentication required
 * 
 * Note: This function needs the track's source.url to construct the proper URL.
 * It will query the database to get this information.
 */
async function kvGetLyrics({ slug }: KvGetLyricsArgs): Promise<KvGetLyricsResult> {
  const browser = await chromium.launch({ headless: true });
  
  try {
    // First, get the track from DB to find the source URL
    const db = await import('../data/db');
    const track = await db.default.tracks.find(slug);
    
    if (!track || !track.source?.url) {
      throw new Error(`Track '${slug}' not found in database or missing source URL`);
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    // Use the source URL (which has artist/title.html format) to construct lyrics URL
    const url = `https://www.karaoke-version.co.uk/karaoke/${track.source.url}`;
    logInfo(`Getting lyrics from: ${url}`);
    
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    // Extract lyrics - try multiple selectors
    let lyrics: string | null = null;
    
    // Try primary selector
    const primarySelector = page.locator('.lyrics .js__lyrics');
    if (await primarySelector.count() > 0) {
      lyrics = await primarySelector.innerText();
    }
    
    // Fallback to broader selector
    if (!lyrics) {
      const fallbackSelector = page.locator('.lyrics');
      if (await fallbackSelector.count() > 0) {
        lyrics = await fallbackSelector.innerText();
      }
    }

    const cleanedLyrics = lyrics?.trim() || null;

    if (!cleanedLyrics) {
      logDebug(`No lyrics found for: ${slug}`);
      return {
        slug,
        lyrics: null,
        found: false,
      };
    }

    logInfo(`Found lyrics for ${slug}: ${cleanedLyrics.length} characters`);
    
    return {
      slug,
      lyrics: cleanedLyrics,
      found: true,
    };
  } catch (error) {
    logError('getLyrics', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export { kvGetLyrics, type KvGetLyricsArgs, type KvGetLyricsResult };
