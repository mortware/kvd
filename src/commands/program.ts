import { Command } from 'commander';
import { registerAudioCommands } from './audio';
import { registerAccountCatalogCommands } from './accountCatalog';
import { registerTrackCommands } from './tracks';
import { registerLyricsCommands } from './lyrics';

export function buildProgram(): Command {
  const program = new Command();

  program
    .name('kvd')
    .description('CLI for managing karaoke-version track catalog imports, assets, and downloads')
    .showHelpAfterError()
    .configureOutput({
      outputError: (str, write) => write(str),
    });

  registerAudioCommands(program);
  registerAccountCatalogCommands(program);
  registerTrackCommands(program);
  registerLyricsCommands(program);

  return program;
}
