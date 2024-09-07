import { CommandModule } from 'yargs';
import { DownloadArgs, downloadSong } from '../actions';

export const downloadCommand: CommandModule<{}, DownloadArgs> = {
  command: 'download',
  describe: 'Download all tracks for the specified song',
  builder: (yargs) => {
    return yargs.option('username', {
      alias: 'u',
      description: 'Karaoke Version username',
      type: 'string',
      demandOption: true,
    }).option('password', {
      alias: 'p',
      description: 'Karaoke Version password',
      type: 'string',
      demandOption: true,
    }).option('url', {
      alias: 'l',
      description: 'Url of the song to download',
      type: 'string',
      demandOption: true,
    }).options('output', {
      alias: 'o',
      description: 'Output folder',
      type: 'string',
      demandOption: true,
    }).option('force', {
      alias: 'f',
      description: 'Force overwrite existing files',
      type: 'boolean',
      default: false,
    });
  },
  handler: downloadSong
};


