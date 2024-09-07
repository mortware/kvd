import { CommandModule } from 'yargs';
import { CatalogArgs, fetchCatalog } from '../actions';

export const catalogCommand: CommandModule<{}, CatalogArgs> = {
  command: 'catalog',
  describe: 'List all tracks in the catalog for this user',
  builder: (yargs) => {
    return yargs
      .option('username', {
        alias: 'u',
        description: 'Karaoke Version username',
        type: 'string',
        demandOption: true,
      })
      .option('password', {
        alias: 'p',
        description: 'Karaoke Version password',
        type: 'string',
        demandOption: true,
      })
      .option('output', {
        alias: 'o',
        description: 'Output file',
        type: 'string',
      })
      .option('queue', {
        alias: 'q',
        description: 'Add items to queue',
        type: 'boolean',
        default: false,
      });
  },
  handler: fetchCatalog
};