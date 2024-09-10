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
  const stemContainers = page.locator(".mixer__inner > .track");

  async function navigate(relativeUrl: string): Promise<string> {
    const url = path.join(KaraokeVersionConfig.baseUrl, 'custombackingtrack', relativeUrl);
    try {
      logDebug(`Navigating to ${url}`);
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      return url;
    } catch (error) {
      logError('navigate', error);
      throw error;
    }
  }

  async function getCurrentPitchValue(): Promise<number> {
    try {
      logDebug("Getting current pitch value");
      const pitchValue = await pitchValueSpan.innerText();
      logDebug("Current pitch value is " + pitchValue);
      return parseInt(pitchValue);
    } catch (error) {
      logError('getCurrentPitchValue', error);
      throw error;
    }
  }

  async function resetSongKey(): Promise<boolean> {
    try {
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
      }
      return requiredReset;
    } catch (error) {
      logError('resetSongKey', error);
      throw error;
    }
  }

  async function getSongInfo(): Promise<SongInfo> {
    try {
      const titleElement = await page.$("#navbar li:last-child");
      const titleText = await titleElement?.innerText() ?? "Unknown Title";

      let artistElement = await page.$("#navbar li:nth-last-child(2)");
      let artistText = await artistElement?.innerText() ?? "Unknown Artist";

      const title = sanitise(titleText);
      const artist = sanitise(artistText);

      const slug = slugify(`${artist}-${title}`);

      let tempo = await getTempo();
      const songInfo = {
        artist,
        title,
        ...tempo,
        slug,
        duration: await getDuration(),
        key: await getKey(),
        stems: await getStems(),
        mixes: await getMixes(),
      };
      logDebug(`Song info: ${JSON.stringify(songInfo, null, 2)}`);
      return songInfo;
    } catch (error) {
      logError('getSongInfo', error);
      throw error;
    }
  };

  async function getStems(): Promise<{ index: number; name: string; slug: string; color: string; order: number; }[]> {
    try {
      const stemElements = await stemContainers.all();

      const stems = [];
      for (let [index, stemElement] of stemElements.entries()) {
        const caption = await stemElement.locator(".track__caption");
        let name = await caption?.innerText();
        name = sanitise(name?.trim() ?? "Unknown");
        let slug = slugify(name);

        const color = await stemElement.evaluate((el) => {
          const style = el.getAttribute('style');
          const rgbMatch = style?.match(/color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

          if (rgbMatch) {
            const r = parseInt(rgbMatch[1] ?? "255", 10);
            const g = parseInt(rgbMatch[2] ?? "255", 10);
            const b = parseInt(rgbMatch[3] ?? "255", 10);

            const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            return `#${hex}`;
          }
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
      logDebug(`Found ${stems.length} stems`);
      return stems;
    } catch (error) {
      logError('getStems', error);
      throw error;
    }
  };

  async function getMixes(): Promise<{ id: string; name: string; slug: string; }[]> {
    try {

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
      logDebug(`Found ${mixes.length} mixes`);
      return mixes;
    } catch (error) {
      logError('getMixes', error);
      throw error;
    }
  }

  async function getTempo(): Promise<{ tempo: number, tempoVariable: boolean }> {
    try {

      let tempoElement = await page.locator("#audio-infos p", { hasText: "Tempo:" }).innerText();

      const tempo = parseFloat(tempoElement.replace(/[^0-9.]/g, ""));
      const tempoVariable = tempoElement.includes("variable");

      logDebug(`Tempo: ${tempo}, Tempo Variable: ${tempoVariable}`);
      return {
        tempo,
        tempoVariable,
      };

    } catch (error) {
      logError('getTempo', error);
      throw error;
    }
  }

  async function getDuration(): Promise<string> {
    try {
      const durationText = await page.locator("#audio-infos p", { hasText: "Duration:" }).innerText();
      const regex = /(\d{2}:\d{2})/;
      const match = durationText.match(regex);

      let duration = "Unknown";
      if (match) {
        duration = match[0];
      }
      logDebug(`Duration: ${duration}`);
      return duration;
    } catch (error) {
      logError('getDuration', error);
      throw error;
    }
  };

  async function getKey(): Promise<string> {
    try {
      const keyText = await page.locator("#audio-infos p", { hasText: "key" }).innerText();
      const regex = /([A-G][#♯b♭]?(m|M)?)/;

      const match = keyText.match(regex);

      let key = "Unknown";
      if (match) {
        key = match[0]
          .replace('♭', 'b')  // Replace special flat with regular 'b'
          .replace('♯', '#'); // Replace special sharp with regular '#'
      }
      logDebug(`Key: ${key}`);
      return key;
    } catch (error) {
      logError('getKey', error);
      throw error;
    }
  }

  async function resetMixer() {
    try {
      const resetBtn = await page.$("button.mixer__reset");
      await resetBtn?.click();
      logDebug("Mixer reset");
    } catch (error) {
      logError('resetMixer', error);
      throw error;
    }
  };

  async function soloTrack(stemIndex: number) {
    try {
      const trackElements = await page.$$(".mixer__inner > .track");
      const trackElement = trackElements[stemIndex];

      const soloBtnElement = await trackElement?.$(`button.track__solo`);
      await soloBtnElement?.click();
      logDebug(`Track '${stemIndex}' soloed`);
    } catch (error) {
      logError('soloTrack', error);
      throw error;
    }
  };

  async function unmuteTrack(stemIndex: number) {
    try {
      const trackElements = await page.$$(".mixer__inner > .track");
      const trackElement = trackElements[stemIndex];

      const muteBtnElement = await trackElement?.$(`button.track__mute`);
      await muteBtnElement?.click();
      logDebug(`Track '${stemIndex}' unmuted`);
    } catch (error) {
      logError('unmuteTrack', error);
      throw error;
    }
  };

  async function getStemStream(index: number): Promise<Readable> {
    try {
      await resetMixer();
      await soloTrack(index);

      const stream = await getDownloadStream();
      logDebug(`Stem '${index}' stream fetched`);
      return stream;
    } catch (error) {
      logError('getStemStream', error);
      throw error;
    }
  }

  async function getMixStream(id: string): Promise<Readable> {
    try {
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
      const stream = await getDownloadStream();
      logDebug(`Mix '${id}' stream fetched`);
      return stream;
    } catch (error) {
      logError('getMixStream', error);
      throw error;
    }
  }

  async function getDownloadStream(): Promise<Readable> {
    logDebug("Fetching download stream...");
    try {
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
    } catch (error) {
      logError('getDownloadStream', error);
      throw error;
    }
  }

  return { navigate, getSongInfo, getStemStream, getMixStream, resetSongKey };
}












