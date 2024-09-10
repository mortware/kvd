import { CommandModule } from "yargs";
import { importTrack, ImportTrackArgs } from "../actions/importTrack";

export const importTrackCommand: CommandModule<{}, ImportTrackArgs> = {
  command: 'track',
  describe: 'Import a single track',
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
      .option('url', {
        alias: 'l',
        description: 'URL of the track to import',
        type: 'string',
        demandOption: true,
      })
      .option('overwrite', {
        alias: 'o',
        describe: 'Overwrite mode',
        choices: ['none', 'file', 'data', 'all'] as const,
        type: 'string',
        default: 'none' as const,
      });
  },
  handler: importTrack,
}

