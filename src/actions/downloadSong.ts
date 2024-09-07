import path from "path";
import localStorage from "../data/file";
import { logDebug, logInfo } from "../lib/logger";
import createContext from "../lib/setup";
import songPage from "../pages/songPage";
import fs from "fs";

type DownloadArgs = {
  username: string;
  password: string;
  url: string;
  output: string;
  force: boolean;
};

async function downloadSong({ username, password, url, output, force }: DownloadArgs) {

  console.log(`Hello, ${username}! Downloading tracks...`);

  const context = await createContext(username, password);

  const page = songPage(context.page);
  await page.navigate(url);
  var requiredReset = await page.resetSongKey();
  const songInfo = await page.getSongInfo();

  const folder = path.join(output, songInfo.slug);
  await localStorage.prepareFolder(folder);

  if (requiredReset) {
    const fullMix = songInfo?.mixes?.find(mix => !mix.id);
    if (fullMix) {
      const stream = await page.getMixStream(fullMix.id);
      await localStorage.saveStreamToDisk(stream, path.join(folder, `${fullMix.slug}.mp3`));
    }
  }

  songInfo.url = url;
  songInfo.source = username;

  logDebug(JSON.stringify(songInfo, null, 2));

  logInfo(`Saving song info and tracks to '${folder}'`);
  const jsonFile = path.join(folder, '_info.json');
  fs.writeFileSync(jsonFile, JSON.stringify(songInfo, null, 2));

  if (songInfo.mixes) {
    for (let mix of songInfo.mixes) {
      const fileName = `${mix.slug}.mp3`;
      const filePath = path.join(folder, fileName);
      if (fs.existsSync(filePath) && !force) {
        logInfo(`Skipping download of '${fileName}' because it already exists`);
        continue;
      }
      const stream = await page.getMixStream(mix.id);
      await localStorage.saveStreamToDisk(stream, filePath);
    }
  }

  if (songInfo.stems) {
    for (let stem of songInfo.stems) {
      const fileName = `${stem.slug}.mp3`;
      const filePath = path.join(folder, fileName);
      if (fs.existsSync(filePath) && !force) {
        logInfo(`Skipping download of '${fileName}' because it already exists`);
        continue;
      }
      const stream = await page.getStemStream(stem.index);
      await localStorage.saveStreamToDisk(stream, filePath);
    }
  }

  logInfo("All done!");

  await context.browser.close();
}

export { downloadSong, type DownloadArgs };