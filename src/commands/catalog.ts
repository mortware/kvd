import { CommandModule } from 'yargs';
import { CatalogArgs, fetchCatalog } from '../actions';
import { logDebug, logError, logInfo } from '../lib/logger';
import automation from '../lib/automation';
import songPagePublic from '../pages/songPagePublic';
import cosmos from '../data/cosmos';
import { v4 as uuidV4 } from 'uuid';
import { Track } from '../lib/models';
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
      const items = await fetchCatalog({ ...args });
      await automation.close();

      const context = await automation.getContext();
      const page = songPagePublic(context.page);

      for (const baseInfo of items) {

        const track = await cosmos.getTrack(baseInfo.slug);
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        if (track && track.updated && new Date(track.updated) > today) {
          logInfo(`Skipping ${baseInfo.slug} because it was updated today`);
          continue;
        }

        await page.navigate(baseInfo.url);
        const metadata = await page.getMetadata();

        if (!track) {
          logDebug(`Track '${baseInfo.slug}' not found. Creating...`);
          const newTrack = {
            created: new Date(),
            title: baseInfo.title,
            artist: baseInfo.artist,
            slug: baseInfo.slug,
            source: {
              url: baseInfo.url,
              id: baseInfo.sourceId,
              users: [args.username],
            },
            ...metadata,
          } as Track;
          await cosmos.create(newTrack);
          await verifyTrack(newTrack);
        } else {
          logDebug(`Track '${track.slug}' found. Id = '${track.id}'. Updating...`);
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
          await cosmos.update(track.id, track.slug, updatedTrack);
          await verifyTrack(updatedTrack);
        }

      }
    } catch (error) {
      logError('Error cataloging tracks', error);
    } finally {
      await cosmos.close();
      await automation.close();
    }
  }
}

async function verifyTrack(track: Track) {

  // Check if the track has a folder
  const hasFolder = await blob.hasFolder(track.slug);
  if (!hasFolder) {
    logInfo(`Track blobs for '${track.slug}' don't exist. Adding to import queue.`);

    await queue.sendMessage('import', {
      import: 'all',
      url: track.source.url,
      users: track.source.users,
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
        url: track.source.url,
        users: track.source.users,
      });
    }
  }

  for (const mix of track.mixes ?? []) {
    const hasBlob = await blob.hasBlob(path.join(track.slug, `${mix.slug}.mp3`));
    if (!hasBlob) {
      logInfo(`Mix ${mix.slug} has no blob for ${track.slug}. Adding to import queue.`);

      await queue.sendMessage('import', {
        import: 'mixes',
        url: track.source.url,
        users: track.source.users,
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
        url: track.source.url,
        users: track.source.users,
      });
      break;
    }
  }

}