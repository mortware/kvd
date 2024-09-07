import { CommandModule } from 'yargs';
import { importTrackCommand } from './importTrack';
import { importQueueCommand } from './importQueue';

export const importCommand: CommandModule = {
  command: 'import',
  describe: 'Import a track or manage the import queue',
  builder: (yargs) => {
    return yargs
      .command(importTrackCommand)
      .command(importQueueCommand)
      .demandCommand(1, 'You need to specify at least one command')
      .help()
      .alias('help', 'h');
  },
  handler: (argv) => { }
};




