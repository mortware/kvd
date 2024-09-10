import blob from "../data/blob";
import db from "../data/db";
import { logDebug, logError, logInfo, logWarning } from "../lib/logger";
import createContext, { Context } from "../lib/setup";
import songPage from "../pages/songPage";
import { z } from "zod";

const ImportTrackArgsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  url: z.string().min(1, "URL is required"),
  overwrite: z.enum(['none', 'file', 'data', 'all']).optional().default('none'),
});
type ImportTrackArgs = z.infer<typeof ImportTrackArgsSchema>;

async function importTrack(args: ImportTrackArgs) {

  let context: Context | null = null;
  try {
    const validatedArgs = ImportTrackArgsSchema.parse(args);
    const { username, password, url, overwrite: overwriteMode } = validatedArgs;

    logInfo(`Importing track from URL: ${args.url}`);

    context = await createContext(username, password);

    const page = songPage(context.page);
    await page.navigate(url);
    var requiredKeyReset = await page.resetSongKey();
    const songInfo = await page.getSongInfo();

    const overwriteFiles = overwriteMode === 'all' || overwriteMode === 'file';
    const overwriteData = overwriteMode === 'all' || overwriteMode === 'data';

    if (overwriteData) {
      const track = await db.tracks.findBySlug(songInfo.slug);
      if (track) {
        await db.tracks.delete(track.Id);
        logWarning(`Deleted track '${songInfo.slug}'`);
      } else {
        logWarning(`User requested to deleted existing track, but '${songInfo.slug}' was not found in the database.`);
      }
    }
    // Create the track in the database
    const track = await db.tracks.create(songInfo.artist, songInfo.title, url, username, songInfo.tempo, songInfo.tempoVariable, songInfo.duration, songInfo.key);
    if (!track || !track.Id) {
      logError(`Failed to create or find track '${songInfo.slug}'`);
      return;
    }

    if (overwriteFiles) {
      const folderExists = await blob.checkFolderExists(track.Slug);
      if (track && folderExists) {
        logWarning(`Deleted track folder '${track.Slug}'`);
        await blob.deleteFolder(track.Slug);
      } else {
        logWarning(`User requested to delete existing track folder, but '${track.Slug}' was not found.`);
      }
    }

    if (songInfo.mixes) {
      for (const mix of songInfo.mixes) {
        const blobName = `${track.Slug}/${mix.slug}.mp3`;
        const exists = await blob.checkExists(blobName);

        if (exists && !overwriteFiles) {
          logInfo(`SKIPPED: Mix '${blobName}' already exists in blob storage.`);
        } else {
          const stream = await page.getMixStream(mix.id);
          await blob.uploadStream(stream, blobName);
        }
        await db.mixes.create(track.Id, mix.name, mix.slug, blobName);

        if (mix.id === '' && requiredKeyReset) {
          logInfo(`Full mix '${blobName}' uploaded after key reset.`);
        }
      }
    }

    if (songInfo.stems) {
      for (const stem of songInfo.stems) {
        const blobName = `${track.Slug}/${stem.slug}.mp3`;

        const exists = await blob.checkExists(blobName);
        if (exists && !overwriteFiles) {
          logInfo(`SKIPPED: Stem '${blobName}' already exists in blob storage.`);
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

