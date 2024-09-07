import blob from "../data/blob";
import db from "../data/db";
import { logError, logInfo } from "../lib/logger";
import createContext from "../lib/setup";
import songPage from "../pages/songPage";

type ImportTrackArgs = {
  username: string;
  password: string;
  url: string;
};

async function importTrack({ username, password, url }: ImportTrackArgs) {
  logInfo(`Importing track from URL: ${url}`);

  const context = await createContext(username, password);

  const page = songPage(context.page);
  await page.navigate(url);
  var requiredReset = await page.resetSongKey();
  const songInfo = await page.getSongInfo();

  const track = await db.tracks.create(songInfo.artist, songInfo.title, songInfo.url, songInfo.source, songInfo.tempo, songInfo.tempoVariable, songInfo.duration, songInfo.key);
  if (!track || !track.Id) {
    logError(`Failed to create or find track '${songInfo.title} by ${songInfo.artist}'`);
    return;
  }

  if (requiredReset) {
    const fullMix = songInfo?.mixes?.find(mix => !mix.id);
    if (fullMix) {
      const stream = await page.getMixStream(fullMix.id);
      await blob.uploadStream(stream, track.Id.toString(), fullMix.slug, '.mp3');
    }
  }

  if (songInfo.mixes) {
    for (const mix of songInfo.mixes) {
      const stream = await page.getMixStream(mix.id);
      await blob.uploadStream(stream, track.Id.toString(), mix.slug, '.mp3');
    }
  }

  if (songInfo.stems) {
    for (const stem of songInfo.stems) {
      const stream = await page.getStemStream(stem.index);
      await blob.uploadStream(stream, track.Id.toString(), stem.slug, '.mp3');
    }
  }

  logInfo("Track import completed successfully!");
  await context.browser.close();
}

export { importTrack, type ImportTrackArgs };
