import { CommandModule } from "yargs";
import { clearQueue, listQueue } from "../actions";
import KvdConfiguration from '../config';

const importQueueName = KvdConfiguration.azure.queue.import as string;

type ImportQueueArgs = {
  action: 'clear' | 'list';
};

export const importQueueCommand: CommandModule<{}, ImportQueueArgs> = {
  command: 'queue <action>',
  describe: 'Manage the import queue',
  builder: (yargs) => {
    return yargs
      .positional('action', {
        describe: 'Action to perform on the queue',
        choices: ['clear', 'list'] as const,
        type: 'string',
        demandOption: true
      });
  },
  handler: handleQueueAction,
}

async function handleQueueAction(args: ImportQueueArgs) {
  const { action } = args;
  switch (action) {
    case 'clear':
      await clearQueue(importQueueName);
      break;
    case 'list':
      await listQueue(importQueueName);
      break;
  }
}