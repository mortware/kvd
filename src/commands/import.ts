import { CommandModule } from 'yargs';
import { logError, logInfo } from '../lib/logger';
import automation from '../lib/automation';
import songPage from '../pages/songPage';
import cosmos from '../data/cosmos';
import queue from '../data/queue';
import { ImportRequest } from '../lib/models';
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
      await cosmos.close();
    }
  }
};

async function processMessage(message: ImportRequest) {
  logInfo(`Importing ${message.import}: ${JSON.stringify(message)}`);

  if (!message.users || message.users.length === 0 || !message.users[0]) {
    throw new Error('No users found in the request');
  }
  const username: string = message.users[0];
  const account = await cosmos.getAccount(username);
  const context = await automation.getContext(account.username, account.password);
  const page = songPage(context.page);
  await page.navigate(message.url);

  const songInfo = await page.getSongInfo();

  async function importStems(stems: { index: number, slug: string }[] | undefined) {
    if (!stems) {
      throw new Error('No stems found on the song page');
    }
    for (const stem of stems) {
      const blobName = path.join(songInfo.slug, `${stem.slug}.mp3`);
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

  async function importMixes(mixes: { id: string | undefined, slug: string }[] | undefined) {
    if (!mixes) {
      throw new Error('No mixes found on the song page');
    }
    for (const mix of mixes) {
      const blobName = path.join(songInfo.slug, `${mix.slug}.mp3`);
      const exists = await blob.checkExists(blobName);
      if (exists) {
        logInfo(`Skipping import of '${blobName}' because it already exists`);
        continue;
      } else {
        const stream = await page.getMixStream(mix.id);
        await blob.uploadStream(stream, blobName);
        logInfo(`Imported mix '${blobName}'`);
      }
    }
  };

  switch (message.import) {
    case 'all':
      await importMixes([{ id: undefined, slug: 'full-mix' }]);
      await importStems(songInfo.stems);
      await importMixes(songInfo.mixes);
      break;
    case 'mixes':
      await importMixes(songInfo.mixes);
      break;
    case 'stems':
      await importStems(songInfo.stems);
      break;
    case 'full-mix':
      await importMixes([{ id: undefined, slug: 'full-mix' }]);
      break;
    default:
      throw new Error(`Invalid import type: ${message.import}`);
  }

  logInfo("Message processed successfully");
}


