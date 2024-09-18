import { Page } from "playwright";
import { logDebug, logError } from "../lib/logger";
import path from "path";
import { KaraokeVersionConfig } from "../consts";
import { sanitise, slugify } from "../lib/utils";
import { Mix, Stem, Track } from "../types";

export default function songPagePublic(page: Page) {
  const stemContainers = page.locator(".mixer__inner > .track");
  const presetContainers = page.locator(".preset-container > .preset");
  const audioInfo = page.locator("#audio-infos");

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

  async function getStems(): Promise<Stem[]> {
    const stems: Stem[] = [];

    try {
      for (const stemElement of await stemContainers.all()) {

        // name
        const caption = await stemElement.locator(".track__caption");
        let name = await caption?.innerText();
        name = sanitise(name?.trim() ?? "Unknown");

        // slug 
        let slug = slugify(name);

        // order
        const orderValue = await stemElement.getAttribute("data-index");
        if (!orderValue) {
          throw new Error(`Order value not found for stem ${name}`);
        }
        const order = parseInt(orderValue);

        // color
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
          name,
          slug,
          color,
          order,
        });
      }
      logDebug(`Found ${stems.length} stems`);
      return stems.sort((a, b) => a.order - b.order);
    } catch (error) {
      logError('getStems', error);
      throw error;
    }
  }

  async function getMixes(): Promise<Mix[]> {
    try {

      const mixes: Mix[] = [];

      for (const mixElement of await presetContainers.all()) {

        // name
        const name = await mixElement.innerText();

        // slug
        const slug = slugify('play along ' + name);

        mixes.push({
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

  async function getTempo() {
    try {

      let tempoElement = await audioInfo.locator("p", { hasText: "Tempo:" }).innerText();

      const bpm = parseFloat(tempoElement.replace(/[^0-9.]/g, ""));
      const variable = tempoElement.includes("variable");

      logDebug(`Tempo: ${bpm}, Tempo Variable: ${variable}`);
      return {
        bpm,
        variable,
      };

    } catch (error) {
      logError('getTempo', error);
      throw error;
    }
  }

  async function getDuration(): Promise<string> {
    try {
      const durationText = await audioInfo.locator("p", { hasText: "Duration:" }).innerText();
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
  }

  async function getKey(): Promise<string> {
    try {
      const keyText = await audioInfo.locator("p", { hasText: "key" }).innerText();
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

  async function getMetadata(): Promise<Partial<Track>> {
    logDebug('Getting metadata...');

    const fullMix = {
      name: "Full Mix",
      slug: slugify("Full Mix"),
    } as Mix;
    const stems = await getStems();
    const mixes = await getMixes();
    const tempo = await getTempo();
    const duration = await getDuration();
    const songKey = await getKey();
    return {
      fullMix,
      stems,
      mixes,
      tempo,
      duration,
      songKey
    };
  }
  return { navigate, getMetadata };
}