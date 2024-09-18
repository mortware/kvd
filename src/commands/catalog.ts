import { CommandModule } from 'yargs';
import { CatalogArgs, fetchCatalog } from '../actions';
import { logDebug, logError, logInfo } from '../lib/logger';
import automation from '../lib/automation';
import songPagePublic from '../pages/songPagePublic';
import db from '../data/db';
import { Track } from '../types';
import blob from '../data/blob';
import queue from '../data/queue';
import path from 'path';

export const catalogCommand: CommandModule<{}, CatalogArgs> = {
  command: 'catalog',
  describe: 'Scans all tracks for this user, creating metadata and stems/mixes in the database',
  builder: (yargs) => {
    return yargs
      .option('username', {
        alias: 'u',
        description: 'Karaoke Version username',
        type: 'string',
        demandOption: true,
      })
  },
  handler: async (args) => {
    try {
      const tracks = await fetchCatalog({ ...args });
      await automation.close();

      const context = await automation.getContext();
      const page = songPagePublic(context.page);

      const processedTracks: Track[] = [];
      for (const basicTrack of tracks) {

        if (!basicTrack.slug || !basicTrack.source?.url) {
          throw new Error(`Track ${basicTrack.title} by ${basicTrack.artist} has no slug or url`);
        }

        const track = await db.tracks.find(basicTrack.slug);
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        // if (track && track.updated && new Date(track.updated) > today) {
        //   logDebug(`Skipping ${basicTrack.slug} because it was updated today`);
        //   processedTracks.push(track);
        //   continue;
        // }

        await page.navigate(basicTrack.source.url);
        const metadata = await page.getMetadata();

        if (!track) {
          logDebug(`Track '${basicTrack.slug}' not found. Creating...`);

          const newTrack = {
            ...basicTrack,
            ...metadata,
            source: {
              ...basicTrack.source,
              users: [args.username],
            },
            created: new Date(),
          } as Track;
          await db.tracks.create(newTrack);
          logInfo(`CREATED track '${newTrack.slug}'`);
          processedTracks.push(newTrack);

        } else {

          delete (track as any).mix;
          const updatedTrack = {
            ...track,
            ...metadata,
            source: {
              ...track.source,
              users: Array.from(new Set([...track.source.users, args.username])),
            },
            updated: new Date(),
          } as Track;
          await db.tracks.update(track.id, track.slug, updatedTrack);
          logInfo(`UPDATED track '${track.slug}'`);
          processedTracks.push(updatedTrack);
        }

      }

      // Verify all the tracks we just processed
      for (const track of processedTracks) {
        await verifyTrack(track);
      }


    } catch (error) {
      logError('Error cataloging tracks', error);
    } finally {
      await db.close();
      await automation.close();
    }
  }
}

async function verifyTrack(track: Track) {
  logDebug(`Verifying track ${track.slug}`);
  // Check if the track has a folder
  const hasFolder = await blob.hasFolder(track.slug);
  if (!hasFolder) {
    logInfo(`Track blobs for '${track.slug}' don't exist. Adding to import queue.`);

    await queue.sendMessage('import', {
      import: 'all',
      slug: track.slug,
    });
    return; // Don't check the rest of the blobs if we are importing all
  }

  // Check if the track has a full mix
  if (!track.fullMix) {
    const hasBlob = await blob.hasBlob(path.join(track.slug, `full-mix.mp3`));
    if (!hasBlob) {
      logInfo(`Full mix has no blob for ${track.slug}. Adding to import queue.`);

      await queue.sendMessage('import', {
        import: 'full-mix',
        slug: track.slug,
      });
    }
  }

  for (const mix of track.mixes ?? []) {
    const hasBlob = await blob.hasBlob(path.join(track.slug, `${mix.slug}.mp3`));
    if (!hasBlob) {
      logInfo(`Mix ${mix.slug} has no blob for ${track.slug}. Adding to import queue.`);

      await queue.sendMessage('import', {
        import: 'mixes',
        slug: track.slug,
      });
      break;
    }
  }

  for (const stem of track.stems ?? []) {
    const hasBlob = await blob.hasBlob(path.join(track.slug, `${stem.slug}.mp3`));
    if (!hasBlob) {
      logInfo(`Stem ${stem.slug} has no blob for ${track.slug}. Adding to import queue.`);

      await queue.sendMessage('import', {
        import: 'stems',
        slug: track.slug,
      });
      break;
    }
  }

}