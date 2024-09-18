import { CommandModule } from 'yargs';
import { logError, logInfo } from '../lib/logger';
import automation from '../lib/automation';
import songPage from '../pages/songPage';
import db from '../data/db';
import queue from '../data/queue';
import { ImportRequest } from '../types';
import path from 'path';
import blob from '../data/blob';

export const importCommand: CommandModule = {
  command: 'import',
  describe: 'Imports requested mp3 files from queue',
  builder: (yargs) => {
    return yargs
      .help()
      .alias('help', 'h');
  },
  handler: async () => {
    try {

      while (true) {
        const message = await queue.getImportRequest();
        if (!message) {
          logInfo('No messages in the import queue');
          break;
        }

        await processMessage(message.item);

        await queue.deleteMessage('import', message.messageId, message.popReceipt);
      }

    } catch (error) {
      logError("Error importing track", error);
    } finally {
      await automation.close();
    }
  }
};

async function processMessage(message: ImportRequest) {
  logInfo(`Importing ${message.import}: ${JSON.stringify(message)}`);

  const track = await db.tracks.find(message.slug);
  if (!track) {
    throw new Error(`Track not found: ${message.slug}`);
  }

  if (!track.source.users || track.source.users.length === 0) {
    throw new Error(`Track has no source users: ${message.slug}`);
  }

  const account = await db.accounts.find(track.source.users[0] as string);
  if (!account) {
    throw new Error(`Account not found: ${track.source.users[0]}`);
  }

  const context = await automation.getContext(account.username, account.password);
  const page = songPage(context.page);
  await page.navigate(track.source.url);

  async function importStems(stems: { index: number, slug: string }[]) {
    if (!stems) {
      throw new Error('No stems found on the song page');
    }
    if (!track) {
      throw new Error(`Track not found: ${message.slug}`);
    }
    for (const stem of stems) {
      const blobName = path.join(track.slug, `${stem.slug}.mp3`);
      const exists = await blob.checkExists(blobName);
      if (exists) {
        logInfo(`Skipping import of '${blobName}' because it already exists`);
        continue;
      } else {
        const stream = await page.getStemStream(stem.index);
        await blob.uploadStream(stream, blobName);
        logInfo(`Imported stem '${blobName}'`);
      }
    }
  };

  async function importMixes(mixes: { name: string | undefined, slug: string }[]) {
    if (!track) {
      throw new Error(`Track not found: ${message.slug}`);
    }
    for (const mix of mixes) {
      const blobName = path.join(track.slug, `${mix.slug}.mp3`);
      const exists = await blob.checkExists(blobName);
      if (exists) {
        logInfo(`Skipping import of '${blobName}' because it already exists`);
        continue;
      } else {
        const stream = await page.getMixStream(mix.name);
        await blob.uploadStream(stream, blobName);
        logInfo(`Imported mix '${blobName}'`);
      }
    }
  };

  switch (message.import) {
    case 'all':
      await importMixes([{ name: undefined, slug: 'full-mix' }]);
      await importStems(track.stems!.map(stem => ({ index: stem.order, slug: stem.slug })));
      await importMixes(track.mixes!.map(mix => ({ name: mix.name, slug: mix.slug })));
      break;
    case 'mixes':
      await importMixes(track.mixes!.map(mix => ({ name: mix.name, slug: mix.slug })));
      break;
    case 'stems':
      await importStems(track.stems!.map(stem => ({ index: stem.order, slug: stem.slug })));
      break;
    case 'full-mix':
      await importMixes([{ name: undefined, slug: 'full-mix' }]);
      break;
    default:
      throw new Error(`Invalid import type: ${message.import}`);
  }

  logInfo("Message processed successfully");
}


