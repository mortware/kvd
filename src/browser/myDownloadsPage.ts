import { Locator, Page } from "playwright";
import { logDebug, logError, logInfo } from "../lib/logger";
import playwright from "playwright";
import { KaraokeVersionConfig } from "../consts";
import { slugify, urlJoin } from "../lib/utils";
import { Track } from "../types";

export type SongItem = {
  sourceId: string;
  url: string;
  title: string;
  artist: string;
  slug: string;
  username?: string;
}

export default function myDownloadPage(page: Page) {

  const trackRows = page.locator("table.my-downloaded-files > tbody > tr");

  async function navigate() {
    const url = urlJoin(KaraokeVersionConfig.baseUrl, "my/download.html");
    logDebug(`Navigating to ${url}`);
    await page.goto(url);
  }

  async function getTracks(): Promise<Partial<Track>[]> {
    logDebug("Fetching tracks");
    const tracks: Partial<Track>[] = [];

    let nextUrl: string | null = "";

    do {

      for (const trackRow of await trackRows.all()) {
        const sourceId = await trackRow.locator("td.my-downloaded-files__vote-area > button").getAttribute("data-songid") as string;
        const songUrl = await trackRow.locator("td.my-downloaded-files__song > a").getAttribute("href") as string;
        const songTitle = await trackRow.locator("td.my-downloaded-files__song").innerText() as string;
        const songArtist = await trackRow.locator("td.my-downloaded-files__artist").innerText() as string;

        if (songUrl?.includes("custombackingtrack")) { // Avoids tracks that aren't custombackingtracks
          tracks.push({
            source: {
              id: sourceId,
              url: songUrl.replace("/custombackingtrack/", "").trim().trim(),
              users: [],
            },
            title: songTitle.trim(),
            artist: songArtist.trim(),
            slug: slugify(songArtist, songTitle),
          });
          logDebug('Track found', sourceId, songUrl?.trim(), songTitle.trim(), songArtist.trim());
        }
      }

      // Check for next button
      const nextBtn = await page.$("div.pagination > a.next");
      nextUrl = nextBtn ? await nextBtn.getAttribute("href") : null;
      if (nextUrl) {
        const url = urlJoin(KaraokeVersionConfig.baseUrl, nextUrl);
        logDebug(`Navigating to ${url}`);
        await page.goto(url);
      }

    } while (nextUrl);

    logInfo(`Found ${tracks.length} tracks.`);
    return tracks;
  }

  return { navigate, getTracks };
}