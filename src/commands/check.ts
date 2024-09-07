import { CommandModule } from 'yargs';
import { check, CheckArgs } from '../actions';

export const checkCommand: CommandModule<{}, CheckArgs> = {
  command: 'check',
  describe: 'Check the status of a track in the catalog',
  builder: (yargs) => {
    return yargs.option('url', {
      alias: 'u',
      description: 'Relative url for the track to check',
      type: 'string',
      demandOption: true,
    });
  },
  handler: check
}