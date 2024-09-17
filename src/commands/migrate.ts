import { CommandModule } from 'yargs';
import { logError, logInfo, logWarning } from '../lib/logger';
import cosmos from '../data/cosmos';
import { Track, TrackItem } from '../lib/models';
import blob from '../data/blob';
import path from 'path';

// Helper function to convert PascalCase to camelCase
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

// Helper function to convert object keys to camelCase
const convertToCamelCase = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [toCamelCase(key), value])
  );
};

const convertSlashes = (obj: any) => {
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/\\/g, '/');
      } else if (typeof obj[key] === 'object') {
        convertSlashes(obj[key]);
      }
    }
  }
  return obj;
};

export const migrateCommand: CommandModule = {
  command: 'migrate',
  describe: 'Migrate from SQL to Cosmos',
  builder: (yargs) => {
    return yargs
      .help()
      .alias('help', 'h');
  },
  handler: async (argv) => {
    try {

      // const track = await cosmos.getTrackWithNoStemsOrMixes();
      // if (!track) {
      //   logInfo('No tracks found');
      //   process.exit(0);
      // }

      // console.log(track);

      // const actions = await scan(track);

      // console.log(actions);

      // for (const action of actions) {
      //   switch (action.type) {
      //     case 'get-stems-info':
      //       const stems = await getStems(action.trackUrl);
      //       track.stems = stems;
      //       break;
      //     case 'get-mixes-info':
      //       const mixes = await getMixes(action.trackUrl);
      //       track.mixes = mixes;
      //       break;
      //   }
      // }
      // console.log(track);

      const tracks = await cosmos.getAllTracks();

      let folderMissing: string[] = [];
      let mixMissing: string[] = [];
      let stemMissing: string[] = [];
      let fullMixMissing: string[] = [];
      for (const track of tracks) {

        const hasFolder = await blob.hasFolder(track.slug);
        if (!hasFolder) {
          logWarning(`Track ${track.slug} has no folder`);
          folderMissing.push(track.slug);
          continue;
        }

        // if (!track.fullMix) {
        //   const hasBlob = await blob.hasBlob(path.join(track.slug, `full-mix.mp3`));
        //   if (!hasBlob) {
        //     logWarning(track.slug, `Full mix has no blob`);
        //     fullMixMissing.push(path.join(track.slug, 'full-mix'));
        //   }
        // }

        // for (const mix of track.mixes ?? []) {
        //   const hasBlob = await blob.hasBlob(path.join(track.slug, `${mix.slug}.mp3`));
        //   if (!hasBlob) {
        //     logWarning(track.slug, `Mix ${mix.slug} has no blob`);
        //     mixMissing.push(path.join(track.slug, mix.slug));
        //   }
        // }

        // for (const stem of track.stems ?? []) {
        //   const hasBlob = await blob.hasBlob(path.join(track.slug, `${stem.slug}.mp3`));
        //   if (!hasBlob) {
        //     logWarning(track.slug, `Stem ${stem.slug} has no blob`);
        //     stemMissing.push(path.join(track.slug, stem.slug));
        //   }
        // }



        // if (!updatedTrack.source) {
        //   updatedTrack.source = {
        //     url: updatedTrack.sourceUrl,
        //     username: updatedTrack.sourceUser,
        //     id: updatedTrack.sourceId,
        //   };
        //   delete updatedTrack.sourceUrl;
        //   delete updatedTrack.sourceUser;
        //   delete updatedTrack.sourceId;

        //   await cosmos.update(track.id, track);
        // }

        // const actions = await scan(track);

        // for (const action of actions) {
        //   console.log("ACTION", action);
        //   switch (action.type) {
        //     case 'get-stems-info':
        //       const stems = await getStems(action.trackUrl);
        //       track.stems = stems;
        //       break;
        //     case 'get-mixes-info':
        //       const mixes = await getMixes(action.trackUrl);
        //       track.mixes = mixes;
        //       break;
        //     case 'get-mix-info':
        //       track.mix = {
        //         name: 'Full Mix',
        //         slug: 'full-mix',
        //         blobName: path.join(track.slug, 'full-mix.mp3'),
        //       };
        //       break;
        //   }
        // }
        // console.log(track);

        // track.tempo = {
        //   bpm: track.tempo,
        //   variable: track.tempoVariable,
        // };

        //break;
      }

      logWarning('Missing track folders', folderMissing);
      logWarning('Missing full mixes', fullMixMissing);
      logWarning('Missing mixes', mixMissing);
      logWarning('Missing stems', stemMissing);

    } catch (error) {
      logError('Error updating tracks', error);
      process.exit(1);
    } finally {
      await cosmos.close();
    }
  }
}

async function scan(track: Track) {
  const actions: any[] = []

  // Check song still exists

  // Check if track has stems or mixes
  if (!track.stems || track.stems.length === 0) {
    actions.push({
      type: 'get-stems-info',
      trackId: track.id,
      trackUrl: track.source.url
    });
  }

  if (!track.mixes || track.mixes.length === 0) {
    actions.push({
      type: 'get-mixes-info',
      trackId: track.id,
      trackUrl: track.source.url
    });
  }

  if (!track.fullMix) {
    actions.push({
      type: 'get-mix-info',
      trackId: track.id,
      trackUrl: track.source.url
    });
  }

  // Check if any mixes or stems are missing their blobs
  const checkItems = async <T extends TrackItem>(items: T[] | undefined, type: 'mix' | 'stem') => {
    if (!items) return;

    for (const item of items) {
      const exists = await blob.checkExists(path.join(track.slug, item.slug, '.mp3'));
      if (!exists) {
        actions.push({
          type: `missing-${type}-blob`,
          trackId: track.id,
          trackUrl: track.source.url,
          username: track.source.users,
          slug: item.slug,
        });
      }
    }
  };

  await checkItems(track.mixes, 'mix');
  await checkItems(track.stems, 'stem');

  return actions;
}