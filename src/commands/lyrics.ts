import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { getLyrics, updateLyrics } from '../features';
import { getKvLyricsSource } from '../integrations/kv/lyrics';
import { printJson } from './shared';

async function runLyricsGet(options: { slug: string }): Promise<void> {
  const result = await getLyrics({
    slug: options.slug,
    source: getKvLyricsSource(),
  });
  printJson(result);
}

async function runLyricsUpdate(options: { slug: string; lyrics?: string; file?: string; clear?: boolean }): Promise<void> {
  const setCount = [options.lyrics ? 1 : 0, options.file ? 1 : 0, options.clear ? 1 : 0].reduce(
    (sum, item) => sum + item,
    0,
  );

  if (setCount !== 1) {
    throw new Error('Use exactly one of: --lyrics, --file, or --clear');
  }

  let lyrics: string | null = null;

  if (options.file) {
    const absolute = path.resolve(process.cwd(), options.file);
    lyrics = await fs.promises.readFile(absolute, 'utf8');
  } else if (options.lyrics !== undefined) {
    lyrics = options.lyrics;
  }

  const result = await updateLyrics({ slug: options.slug, lyrics });
  printJson(result);
}

export function registerLyricsCommands(program: Command): void {
  const lyrics = program.command('lyrics').description('Lyrics operations');

  lyrics
    .command('get')
    .description('Fetch lyrics for a stored track from karaoke-version')
    .requiredOption('--slug <slug>', 'Track slug')
    .action(async (options: { slug: string }) => {
      await runLyricsGet(options);
    });

  lyrics
    .command('update')
    .description('Update or clear lyrics for a stored track')
    .requiredOption('--slug <slug>', 'Track slug')
    .option('--lyrics <text>', 'Inline lyric text')
    .option('--file <path>', 'Load lyric text from local file')
    .option('--clear', 'Remove lyrics', false)
    .action(async (options: { slug: string; lyrics?: string; file?: string; clear?: boolean }) => {
      await runLyricsUpdate(options);
    });
}
