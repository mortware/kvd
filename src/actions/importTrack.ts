import blob from "../data/blob";
import db from "../data/db";
import { logDebug, logError, logInfo } from "../lib/logger";
import createContext, { Context } from "../lib/setup";
import songPage from "../pages/songPage";
import { z } from "zod";

const ImportTrackArgsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  url: z.string().min(1, "URL is required"),
});
type ImportTrackArgs = z.infer<typeof ImportTrackArgsSchema>;

async function importTrack(args: ImportTrackArgs) {

  let context: Context | null = null;
  try {
    const validatedArgs = ImportTrackArgsSchema.parse(args);
    const { username, password, url } = validatedArgs;

    logInfo(`Importing track from URL: ${args.url}`);

    context = await createContext(username, password);

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
        const blobName = `${track.Slug}/${fullMix.slug}.mp3`;
        const exists = await blob.checkExists(blobName);
        if (exists) {
          logInfo(`Full mix '${blobName}' already exists in blob storage. Skipping upload.`);
        } else {
          const stream = await page.getMixStream(fullMix.id);
          await blob.uploadStream(stream, blobName);
        }
        await db.mixes.create(track.Id, fullMix.name, fullMix.slug, blobName);
      }
    }

    if (songInfo.mixes) {
      for (const mix of songInfo.mixes) {
        const blobName = `${track.Slug}/${mix.slug}.mp3`;
        const exists = await blob.checkExists(blobName);
        if (exists) {
          logInfo(`Mix '${blobName}' already exists in blob storage. Skipping upload.`);
        } else {
          const stream = await page.getMixStream(mix.id);
          await blob.uploadStream(stream, blobName);
        }
        await db.mixes.create(track.Id, mix.name, mix.slug, blobName);
      }
    }

    if (songInfo.stems) {
      for (const stem of songInfo.stems) {
        const blobName = `${track.Slug}/${stem.slug}.mp3`;
        const exists = await blob.checkExists(blobName);
        if (exists) {
          logInfo(`Stem '${blobName}' already exists in blob storage. Skipping upload.`);
        } else {
          const stream = await page.getStemStream(stem.index);
          await blob.uploadStream(stream, blobName);
        }
        await db.stems.create(track.Id, stem.name, stem.slug, "#000000", blobName, stem.order);
      }
    }

    logInfo("Track import completed successfully!");

  } catch (error) {
    if (error instanceof z.ZodError) {
      logError(`Validation error: ${error.errors.map(e => e.message).join(", ")}`);
    } else {
      logError(`Unexpected error: ${error}`);
    }
    throw error;
  } finally {
    await context?.browser.close();
  }
}

export { importTrack, type ImportTrackArgs };

