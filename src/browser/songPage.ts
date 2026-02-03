import { Page } from "playwright";
import { Readable } from "stream";
import { logDebug, logError, logWarning } from "../lib/logger";
import { urlJoin } from "../lib/utils";
import { KaraokeVersionConfig } from "../consts";

export default function songPage(page: Page) {
  const pitchValueSpan = page.locator("span.pitch__value");
  const pitchResetLink = page.locator("#pitch-link");
  const keyDownButton = page.locator('button.btn--pitch:nth-of-type(1)'); // First button is "Key down"
  const keyUpButton = page.locator('button.btn--pitch:nth-of-type(2)');   // Second button is "Key up"
  const presetsContainer = page.locator(".preset-container");

  async function navigate(relativeUrl: string): Promise<string> {
    const url = urlJoin(KaraokeVersionConfig.baseUrl, 'custombackingtrack', relativeUrl);
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

  async function getMixStream(name: string | undefined): Promise<Readable> {
    try {
      if (!name) {
        logDebug("Downloading full mix");
        await resetMixer();
      } else {

        // Find the preset button from the name
        logDebug(`Downloading preset mix '${name}'`);

        const presetElement = await presetsContainer.locator('.preset')
          .filter({ hasText: name })
          .first()

        if (presetElement == null) {
          const error = `Preset mix '${name}' not found`;
          logError(error);
          throw Error(error);
        }
        await presetElement.click();
      }
      const stream = await getDownloadStream();
      logDebug(`Mix '${name}' stream fetched`);
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

  return { navigate, getStemStream, getMixStream, resetSongKey };
}












