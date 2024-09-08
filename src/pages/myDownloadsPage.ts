import { Page } from "playwright";
import { logDebug, logError, logInfo } from "../lib/logger";
import playwright from "playwright";
import { KaraokeVersionConfig } from "../consts";
import path from "path";

export default function myDownloadPage(page: Page) {
  async function navigate() {
    const url = path.join(KaraokeVersionConfig.baseUrl, "my/download.html");
    logDebug(`Navigating to ${url}`);
    await page.goto(`${url}`);
  }

  async function getTracks() {
    logDebug("Fetching tracks");
    const tracks: string[] = [];
    let nextUrl: string | null = "";

    async function processTrackLink(trackLink: playwright.ElementHandle) {
      let trackUrl = await trackLink.getAttribute("href");
      if (!trackUrl) {
        logError("No track URL found.");
        return;
      }

      if (trackUrl.includes("custombackingtrack")) {
        trackUrl = trackUrl.replace("/custombackingtrack/", "").trim();
        tracks.push(trackUrl);
        logDebug(`Found track: ${trackUrl}`);
      }
    }

    do {
      // Get track link elements
      const trackLinks = await page.$$(
        "table.my-downloaded-files > tbody > tr > td.my-downloaded-files__song > a"
      );

      await Promise.all(trackLinks.map(processTrackLink));

      // Check for next button
      const nextBtn = await page.$("div.pagination > a.next");
      nextUrl = nextBtn ? await nextBtn.getAttribute("href") : null;
      if (nextUrl) {
        logDebug(`Navigating to ${KaraokeVersionConfig.baseUrl}${nextUrl}`);
        await page.goto(`${KaraokeVersionConfig.baseUrl}${nextUrl}`);
      }

    } while (nextUrl);

    logInfo(`Found ${tracks.length} tracks.`);
    return tracks;
  }

  return { navigate, getTracks };
}