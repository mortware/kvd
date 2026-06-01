import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { Command } from 'commander';
import blob from '../data/blob';
import db from '../data/db';
import { Track } from '../types';
import { logInfo, logWarning } from '../lib/logger';
import {
  CliArgs,
  parsePositiveInt,
  parseMultiSelect,
  searchTracks,
  chooseTrack,
  ensureLocalFile,
  fileExists,
  promptYesNo,
  runFfmpeg,
  buildManifest,
  chooseFiles,
  toCliArgs,
} from './shared';

export async function runMix(args: CliArgs): Promise<void> {
  const rl = readline.createInterface({ input, output });

  try {
    let selectedTrack: Track | null = null;

    if (args.slug) {
      selectedTrack = await db.tracks.find(args.slug);
      if (!selectedTrack) {
        throw new Error(`Track not found for slug: ${args.slug}`);
      }
    } else {
      const tracks = await searchTracks(args, rl);
      if (tracks.length === 0) {
        logInfo('No tracks found for the provided search/filter criteria.');
        return;
      }

      selectedTrack = await chooseTrack(tracks, rl);
      if (!selectedTrack) {
        throw new Error('Invalid track selection.');
      }
    }

    const stems = selectedTrack.stems ?? [];
    if (stems.length === 0) {
      logWarning('This track has no stems in the database.');
      return;
    }

    const trackDir = path.join(args.outputDir, selectedTrack.slug);

    console.log('');
    console.log('Stems (select which to include in the backing mix):');
    stems.forEach((stem, index) => {
      console.log(`  ${index + 1}. ${stem.name}`);
    });

    const stemAnswer = await rl.question('\nSelect stems (e.g. 1,2,4-6 or all): ');
    const selectedIndexes = parseMultiSelect(stemAnswer, stems.length);

    if (selectedIndexes.length === 0) {
      logWarning('No stems selected.');
      return;
    }

    const selectedStems = selectedIndexes
      .map((index) => stems[index - 1])
      .filter((stem): stem is NonNullable<typeof stem> => Boolean(stem));

    logInfo('Ensuring stems are cached locally...');
    for (const stem of selectedStems) {
      const stemBlobPath = `${selectedTrack.slug}/${stem.slug}.mp3`;
      const stemLocalPath = path.join(trackDir, `${stem.slug}.mp3`);
      await ensureLocalFile(stemBlobPath, stemLocalPath);
    }

    const clickMix = (selectedTrack.mixes ?? []).find((mix) => mix.slug === 'intro-count-click');
    let clickLocalPath: string | undefined;
    if (clickMix) {
      const clickBlobPath = `${selectedTrack.slug}/intro-count-click.mp3`;
      const localClickPath = path.join(trackDir, 'intro-count-click.mp3');
      await ensureLocalFile(clickBlobPath, localClickPath);
      clickLocalPath = localClickPath;
    } else {
      logWarning('intro-count-click not found in track metadata. Click track output will be skipped.');
    }

    const backingOut = path.join(trackDir, `${selectedTrack.slug}-backing.wav`);
    const clickOut = path.join(trackDir, `${selectedTrack.slug}-click.wav`);

    const stemCount = selectedStems.length;
    const volumeScale = (1 / stemCount).toFixed(4);
    const ffmpegInputs = selectedStems.flatMap((stem) => ['-i', path.join(trackDir, `${stem.slug}.mp3`)]);

    const filterParts = selectedStems.map((_, index) => `[${index}]volume=${volumeScale}[a${index}]`);
    const mixInputs = selectedStems.map((_, index) => `[a${index}]`).join('');
    const filterComplex = [
      ...filterParts,
      `${mixInputs}amix=inputs=${stemCount}:normalize=0,alimiter=limit=0.95:attack=5:release=50[out]`,
    ].join('; ');

    const backingArgs = [
      ...ffmpegInputs,
      '-filter_complex',
      filterComplex,
      '-map',
      '[out]',
      '-ar',
      '44100',
      '-ac',
      '2',
      '-c:a',
      'pcm_s16le',
      '-y',
      backingOut,
    ];

    const backingExists = await fileExists(backingOut);
    if (backingExists) {
      const overwriteBacking = await promptYesNo(rl, `Backing mix already exists. Overwrite?\n  ${backingOut}`);
      if (!overwriteBacking) {
        logInfo(`Skipping backing mix overwrite: ${backingOut}`);
      } else {
        logInfo(`Mixing ${stemCount} stem${stemCount === 1 ? '' : 's'} into backing track...`);
        await runFfmpeg(backingArgs);
        logInfo(`Backing mix written to: ${backingOut}`);
      }
    } else {
      logInfo(`Mixing ${stemCount} stem${stemCount === 1 ? '' : 's'} into backing track...`);
      await runFfmpeg(backingArgs);
      logInfo(`Backing mix written to: ${backingOut}`);
    }

    if (clickLocalPath) {
      const includeClick = await promptYesNo(rl, 'Also export click track as a separate WAV file?');
      if (!includeClick) {
        logInfo('Skipping click track export.');
        return;
      }

      const clickArgs = [
        '-i',
        clickLocalPath,
        '-ar',
        '44100',
        '-ac',
        '2',
        '-c:a',
        'pcm_s16le',
        '-y',
        clickOut,
      ];

      const clickExists = await fileExists(clickOut);
      if (clickExists) {
        const overwriteClick = await promptYesNo(rl, `Click WAV already exists. Overwrite?\n  ${clickOut}`);
        if (!overwriteClick) {
          logInfo(`Skipping click WAV overwrite: ${clickOut}`);
          return;
        }
      }

      logInfo('Converting click track to WAV...');
      await runFfmpeg(clickArgs);
      logInfo(`Click track written to: ${clickOut}`);
    }
  } finally {
    rl.close();
  }
}

export async function runDownload(args: CliArgs): Promise<void> {
  const rl = readline.createInterface({ input, output });

  try {
    let selectedTrack: Track | null = null;

    if (args.slug) {
      selectedTrack = await db.tracks.find(args.slug);
      if (!selectedTrack) {
        throw new Error(`Track not found for slug: ${args.slug}`);
      }
    } else {
      const tracks = await searchTracks(args, rl);
      if (tracks.length === 0) {
        logInfo('No tracks found for the provided search/filter criteria.');
        return;
      }

      selectedTrack = await chooseTrack(tracks, rl);
      if (!selectedTrack) {
        throw new Error('Invalid track selection.');
      }
    }

    const manifest = await buildManifest(selectedTrack);
    if (manifest.length === 0) {
      logWarning('No files were found in blob storage for the selected track.');
      return;
    }

    const selectedFiles = await chooseFiles(manifest, rl);
    if (selectedFiles.length === 0) {
      logWarning('No files selected.');
      return;
    }

    const targetRoot = path.join(args.outputDir, selectedTrack.slug);
    await fs.promises.mkdir(targetRoot, { recursive: true });

    let downloaded = 0;
    let skipped = 0;

    for (const file of selectedFiles) {
      if (!file.available) {
        logWarning(`Skipping unavailable file: ${file.blobPath}`);
        skipped += 1;
        continue;
      }

      const localFileName = path.basename(file.blobPath);
      const localPath = path.join(targetRoot, localFileName);

      try {
        await fs.promises.access(localPath);
        logInfo(`Skipping existing local file: ${localPath}`);
        skipped += 1;
        continue;
      } catch {
        // File is not present locally; continue with download.
      }

      await blob.downloadToFile(file.blobPath, localPath);
      downloaded += 1;
    }

    logInfo(`Download complete. Downloaded: ${downloaded}, skipped: ${skipped}.`);
    logInfo(`Output directory: ${targetRoot}`);
  } finally {
    rl.close();
  }
}

export function addSharedDownloadMixOptions(command: Command): Command {
  return command
    .option('-s, --search <text>', 'Search by slug/artist/title text')
    .option('-u, --username <name>', 'Filter tracks by owning username')
    .option('--slug <slug>', 'Select an exact track slug without prompting')
    .option('-o, --output <dir>', 'Target root directory', 'downloads')
    .option('-l, --limit <n>', 'Max search results shown (default: 25, max: 100)', parsePositiveInt, 25);
}

export function registerAudioCommands(program: Command): void {
  addSharedDownloadMixOptions(
    program.command('download').description('Search tracks and download available files from Azure Blob Storage.'),
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runDownload(toCliArgs(options));
  });

  addSharedDownloadMixOptions(
    program.command('mix').description('Create local WAV mixes from downloaded stem files via ffmpeg.'),
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runMix(toCliArgs(options));
  });
}

export function registerTrackAudioAliases(track: Command): void {
  addSharedDownloadMixOptions(
    track.command('download').description('Shorthand for: kvd download'),
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runDownload(toCliArgs(options));
  });

  addSharedDownloadMixOptions(
    track.command('mix').description('Shorthand for: kvd mix'),
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runMix(toCliArgs(options));
  });
}
