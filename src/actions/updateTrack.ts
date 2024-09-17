// import blob from "../data/blob";
// import db from "../data/db";
// import { logDebug, logError, logInfo, logWarning } from "../lib/logger";
// import createContext, { Context } from "../lib/automation";
// import songPage from "../pages/songPage";
// import { z } from "zod";

// const UpdateTrackArgsSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(1, "Password is required"),
//   url: z.string().min(1, "URL is required"),
// });
// export type UpdateTrackArgs = z.infer<typeof UpdateTrackArgsSchema>;

// /**
//  * Updates a track in the database with the information from the song page.
//  * Caution: Overwrites existing data.
//  * @param {UpdateTrackArgs} args - The arguments for the update track action.
//  * @throws {Error} If the track is not found or if there's a validation error.
//  */
// async function updateTrack(args: UpdateTrackArgs) {

//   let context: Context | null = null;
//   try {
//     const validatedArgs = UpdateTrackArgsSchema.parse(args);
//     const { username, password, url } = validatedArgs;

//     context = await createContext(username, password);
//     const page = songPage(context.page);
//     await page.navigate(url);
//     const songInfo = await page.getSongInfo();
//     const track = await db.tracks.findBySlug(songInfo.slug);
//     if (!track) {
//       throw new Error(`Track not found: ${songInfo.slug}`);
//     }

//     await db.tracks.update(track.Id, songInfo.artist, songInfo.title, songInfo.slug, url, username, songInfo.tempo, songInfo.tempoVariable, songInfo.duration, songInfo.key);

//     for (const stem of songInfo.stems ?? []) {
//       await db.stems.update(track.Id, stem.name, stem.slug, stem.color, stem.order);
//     }

//     for (const mix of songInfo.mixes ?? []) {
//       await db.mixes.update(track.Id, mix.name, mix.slug);
//     }

//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       logError(`Validation error: ${error.errors.map(e => e.message).join(", ")}`);
//     } else {
//       logError(`Unexpected error: ${error}`);
//     }
//     throw error;
//   } finally {
//     await db.close();
//     if (context) {
//       await context?.browser.close();
//     }
//   }
// }

// export default updateTrack;
