import { chromium } from 'playwright';
import { logDebug, logError, logInfo } from '../../../../lib/logger';
import { LyricsFetchArgs, LyricsFetchResult } from '../../../../features/lyrics/sources/LyricsSource';

export async function fetchKvLyrics({ slug, sourceUrl }: LyricsFetchArgs): Promise<LyricsFetchResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = `https://www.karaoke-version.co.uk/karaoke/${sourceUrl}`;
    logInfo(`Getting lyrics from: ${url}`);

    await page.goto(url);
    await page.waitForLoadState('networkidle');

    let lyrics: string | null = null;

    const primarySelector = page.locator('.lyrics .js__lyrics');
    if (await primarySelector.count() > 0) {
      lyrics = await primarySelector.innerText();
    }

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
        lyrics: null,
        found: false,
      };
    }

    logInfo(`Found lyrics for ${slug}: ${cleanedLyrics.length} characters`);

    return {
      lyrics: cleanedLyrics,
      found: true,
    };
  } catch (error) {
    logError('fetchKvLyrics', error);
    throw error;
  } finally {
    await browser.close();
  }
}
