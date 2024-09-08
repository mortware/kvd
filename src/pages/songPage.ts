import { Page } from "playwright";
import { Readable } from "stream";
import { logDebug, logError, logWarning } from "../lib/logger";
import { SongInfo } from "../lib/models.js";
import { sanitise, slugify } from "../lib/utils.js";
import path from "path";
import { KaraokeVersionConfig } from "../consts";

export default function songPage(page: Page) {
  const pitchValueSpan = page.locator("span.pitch__value");
  const pitchResetLink = page.locator("#pitch-link");
  const keyDownButton = page.locator('button.btn--pitch:nth-of-type(1)'); // First button is "Key down"
  const keyUpButton = page.locator('button.btn--pitch:nth-of-type(2)');   // Second button is "Key up"

  async function navigate(relativeUrl: string): Promise<string> {
    const url = path.join(KaraokeVersionConfig.baseUrl, 'custombackingtrack', relativeUrl);
    logDebug(`Navigating to ${url}`);
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    return url;
  }

  async function getCurrentPitchValue(): Promise<number> {
    logDebug("Getting current pitch value");
    const pitchValue = await pitchValueSpan.innerText();
    logDebug("Current pitch value is " + pitchValue);
    return parseInt(pitchValue);
  }

  async function resetSongKey(): Promise<boolean> {
    logDebug("Asserting default song key");
    await resetMixer();

    let currentPitch = await getCurrentPitchValue();
    let userPitch = currentPitch;

    let requiredReset = false;
    while (currentPitch !== 0) {
      logDebug(`Adjusting pitch to 0 from ${currentPitch}`);
      requiredReset = true;
      if (currentPitch > 0) {
        await keyDownButton.click();
      } else if (currentPitch < 0) {
        await keyUpButton.click();
      }
      currentPitch = await getCurrentPitchValue();
    }
    if (requiredReset) {
      await pitchResetLink.click();
      logWarning(`Song pitch required resetting (was ${userPitch})`);
      await page.waitForLoadState("networkidle");
    }
    return requiredReset;
  }

  async function getSongInfo(): Promise<SongInfo> {
    logDebug("Fetching song info");
    const titleElement = await page.$("#navbar li:last-child");
    const titleText = await titleElement?.innerText() ?? "Unknown Title";

    let artistElement = await page.$("#navbar li:nth-last-child(2)");
    let artistText = await artistElement?.innerText() ?? "Unknown Artist";

    const title = sanitise(titleText);
    const artist = sanitise(artistText);

    const slug = slugify(`${artist}-${title}`);

    let tempo = await getTempo();

    return {
      url: "",
      artist,
      title,
      ...tempo,
      slug,
      duration: await getDuration(),
      key: await getKey(),
      source: "",
      stems: await getStems(),
      mixes: await getMixes(),
    };
  };

  async function getStems(): Promise<{ index: number; name: string; slug: string; color: string; order: number; }[]> {
    logDebug("Fetching stems");
    const stemElements = await page.$$(".mixer__inner > .track");
    const stems = [];
    for (let [index, stemElement] of stemElements.entries()) {
      const caption = await stemElement.$(".track__caption");
      let name = await caption?.innerText();
      name = sanitise(name?.trim() ?? "Unknown");
      let slug = slugify(`${String(index).padStart(2, "0")} ${name}`);

      const color = await stemElement.evaluate((el) => {
        // const rgb = window.getComputedStyle(el).getPropertyValue('color');
        // const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        // if (match) {
        //   const r = parseInt(match[1] ?? "255", 10);
        //   const g = parseInt(match[2] ?? "255", 10);
        //   const b = parseInt(match[3] ?? "255", 10);

        //   const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        //   return `#${hex}`;
        // }
        return '#000000'
      });

      stems.push({
        index,
        name,
        slug,
        color,
        order: index,
      });
    }
    return stems;
  };

  async function getMixes(): Promise<{ id: string; name: string; slug: string; }[]> {
    logDebug("Fetching mixes");
    const mixes = [];
    mixes.push({
      id: "",
      name: "Full Mix",
      slug: slugify("Full Mix"),
    });

    const presetElements = await page.$$(".preset-container > .preset");

    for (let [_, presetElement] of presetElements.entries()) {
      const name = await presetElement.innerText();
      const slug = slugify('play along ' + name);
      const id = await presetElement.evaluate((el) => el.getAttribute("data-preset-id"))!;

      mixes.push({
        id: id,
        name,
        slug,
      });
    }
    return mixes;
  }

  async function getTempo(): Promise<{ tempo: number, tempoVariable: boolean }> {
    logDebug("Fetching tempo");
    let tempoElement = await page.locator("#audio-infos p", { hasText: "Tempo:" }).innerText();

    const tempo = parseFloat(tempoElement.replace(/[^0-9.]/g, ""));
    const tempoVariable = tempoElement.includes("variable");

    return {
      tempo,
      tempoVariable,
    };
  }

  async function getDuration(): Promise<string> {
    logDebug("Fetching duration");
    const durationText = await page.locator("#audio-infos p", { hasText: "Duration:" }).innerText();
    const regex = /(\d{2}:\d{2})/;
    const match = durationText.match(regex);

    if (match) {
      const duration = match[0];
      return duration;
    } else {
      return "Unknown";
    }
  };

  async function getKey(): Promise<string> {
    logDebug("Fetching key");
    const keyText = await page.locator("#audio-infos p", { hasText: "key" }).innerText();
    const regex = /([A-G][#b]?(m|M)?)/;

    const match = keyText.match(regex);

    if (match) {
      const key = match[0];
      return key;
    } else {
      return "Unknown";
    }
  }

  // async function downloadMix(id: string, slug: string, folder: string): Promise<void> {

  //   let filename: string;

  //   if (!id) {
  //     // Full mix, so reset the mixer and hit the download button
  //     resetMixer();
  //     filename = "full-mix.mp3";
  //   } else {
  //     // Preset mix, so click the preset
  //     const presetElement = await page.$(`.preset-container > .preset[data-preset-id='${id}']`);
  //     if (presetElement == null) {
  //       const error = `Preset mix '${slug}' not found`;
  //       logError(error);
  //       throw Error(error)
  //     }
  //     await presetElement.click();
  //     filename = `${slug}.mp3`;
  //   }
  //   const downloadPath = path.join(folder, filename);

  //   await download(downloadPath);
  // }

  // async function downloadStem(index: number, slug: string, folder: string): Promise<void> {
  //   // Reset mixer and solo the track
  //   await resetMixer();
  //   await soloTrack(index);

  //   const filename = `${slug}.mp3`;
  //   const downloadPath = path.join(folder, filename);

  //   await download(downloadPath);
  // }

  // async function download(downloadPath: string): Promise<void> {

  //   try {
  //     if (fileExists(downloadPath)) {
  //       logInfo(`${downloadPath} SKIPPED`);
  //       return;
  //     } else {
  //       const [download] = await Promise.all([
  //         page.waitForEvent("download", { timeout: 120 * 1000 }),
  //         page.click("a.download", { timeout: 120 * 1000 }),
  //       ]);
  //       await download.saveAs(downloadPath);
  //       await page.click(".js-modal-close.modal__close");
  //       logInfo(`${downloadPath} OK`);
  //     }
  //   } catch (error) {
  //     logError(JSON.stringify(error));
  //   }
  // }

  async function resetMixer() {
    logDebug("Resetting mixer");
    const resetBtn = await page.$("button.mixer__reset");
    await resetBtn?.click();
  };

  async function soloTrack(stemIndex: number) {
    const trackElements = await page.$$(".mixer__inner > .track");
    const trackElement = trackElements[stemIndex];

    const soloBtnElement = await trackElement?.$(`button.track__solo`);
    await soloBtnElement?.click();
  };

  async function unmuteTrack(stemIndex: number) {
    const trackElements = await page.$$(".mixer__inner > .track");
    const trackElement = trackElements[stemIndex];

    const muteBtnElement = await trackElement?.$(`button.track__mute`);
    await muteBtnElement?.click();
  };

  async function getStemStream(index: number): Promise<Readable> {
    await resetMixer();
    await soloTrack(index);
    return await getDownloadStream();
  }

  async function getMixStream(id: string): Promise<Readable> {
    if (!id) {
      logDebug("Downloading full mix");
      await resetMixer();
    } else {
      logDebug(`Downloading preset mix '${id}'`);
      const presetElement = await page.$(`.preset-container > .preset[data-preset-id='${id}']`);
      if (presetElement == null) {
        const error = `Preset mix '${id}' not found`;
        logError(error);
        throw Error(error);
      }
      await presetElement.click();
    }
    return await getDownloadStream();
  }

  async function getDownloadStream(): Promise<Readable> {
    logDebug("Fetching download stream...");
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 120 * 1000 }),
      page.click("a.download", { timeout: 120 * 1000 }),
    ]);

    const readableStream = await download.createReadStream();
    if (!readableStream) {
      throw new Error("Failed to create readable stream from download");
    }

    await page.click(".js-modal-close.modal__close");
    return Readable.from(readableStream);
  }

  return { navigate, getSongInfo, getStemStream, getMixStream, resetSongKey };
}












