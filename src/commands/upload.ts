import { CommandModule } from "yargs";
import { UploadArgs, uploadSong } from "../actions";

export const uploadCommand: CommandModule<{}, UploadArgs> = {
  command: 'upload',
  describe: 'Uploads a song and it\'s tracks to the database from disk',
  builder: (yargs) => {
    return yargs.option('input', {
      alias: 'i',
      description: 'Folder containing the song information',
      type: 'string',
      demandOption: true,
    });
  },
  handler: uploadSong
};



