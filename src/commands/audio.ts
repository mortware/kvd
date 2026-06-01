import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { spawn } from 'child_process';
import { stdin as input, stdout as output } from 'process';
import { checkbox } from '@inquirer/prompts';
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

const COUNT_IN_BARS_TO_MUTE = 1;
const DEFAULT_BEATS_PER_BAR = 4;
const DURATION_MATCH_TOLERANCE_SECONDS = 0.02;

function getCountInSilenceSeconds(track: Track): number | null {
  const bpm = track.tempo?.bpm;

  if (!Number.isFinite(bpm) || !bpm || bpm <= 0) {
    return null;
  }

  return (COUNT_IN_BARS_TO_MUTE * DEFAULT_BEATS_PER_BAR * 60) / bpm;
}

function getAudioDurationSeconds(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ];

    const proc = spawn('ffprobe', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdoutData = '';
    let stderrData = '';

    proc.stdout?.on('data', (chunk: Buffer) => { stdoutData += chunk.toString(); });
    proc.stderr?.on('data', (chunk: Buffer) => { stderrData += chunk.toString(); });
    proc.on('error', (err) => reject(new Error(`Failed to start ffprobe: ${err.message}`)));
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe exited with code ${code}: ${stderrData.slice(-400)}`));
        return;
      }

      const parsed = Number.parseFloat(stdoutData.trim());
      if (!Number.isFinite(parsed) || parsed <= 0) {
        reject(new Error(`Invalid audio duration from ffprobe for ${filePath}: ${stdoutData.trim()}`));
        return;
      }

      resolve(parsed);
    });
  });
}

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

    const cacheRoot = path.resolve(process.cwd(), 'downloads');
    const cacheTrackDir = path.join(cacheRoot, selectedTrack.slug);
    const outputTrackDir = path.join(args.outputDir, selectedTrack.slug);
    await fs.promises.mkdir(outputTrackDir, { recursive: true });

    console.log('');
    let selectedStems: Array<(typeof stems)[number]> = [];

    if (process.stdin.isTTY) {
      const selectedStemIndexes = await checkbox<number>({
        message: 'Select stems for backing mix',
        pageSize: Math.min(14, stems.length + 2),
        choices: stems.map((stem, index) => ({
          value: index,
          name: stem.name,
          description: stem.slug,
          checked: true,
        })),
      });

      selectedStems = selectedStemIndexes
        .map((index) => stems[index])
        .filter((stem): stem is NonNullable<typeof stem> => Boolean(stem));
    } else {
      console.log('Stems (select which to include in the backing mix):');
      stems.forEach((stem, index) => {
        console.log(`  ${index + 1}. ${stem.name}`);
      });

      const stemAnswer = await rl.question('\nSelect stems (e.g. 1,2,4-6 or all): ');
      const selectedIndexes = parseMultiSelect(stemAnswer, stems.length);
      selectedStems = selectedIndexes
        .map((index) => stems[index - 1])
        .filter((stem): stem is NonNullable<typeof stem> => Boolean(stem));
    }

    if (selectedStems.length === 0) {
      logWarning('No stems selected.');
      return;
    }

    logInfo('Ensuring stems are cached locally...');
    for (const stem of selectedStems) {
      const stemBlobPath = `${selectedTrack.slug}/${stem.slug}.mp3`;
      const stemLocalPath = path.join(cacheTrackDir, `${stem.slug}.mp3`);
      await ensureLocalFile(stemBlobPath, stemLocalPath);
    }

    let clickLocalPath: string | undefined;
    const clickBlobPath = `${selectedTrack.slug}/intro-count-click.mp3`;
    if (await blob.hasBlob(clickBlobPath)) {
      const localClickPath = path.join(cacheTrackDir, 'intro-count-click.mp3');
      await ensureLocalFile(clickBlobPath, localClickPath);
      clickLocalPath = localClickPath;
    } else {
      logWarning('intro-count-click.mp3 not found in blob storage. Click track output will be skipped.');
    }

    const backingOut = path.join(outputTrackDir, `${selectedTrack.slug}-backing.wav`);
    const clickOut = path.join(outputTrackDir, `${selectedTrack.slug}-click.wav`);

    const stemCount = selectedStems.length;
    const volumeScale = (1 / stemCount).toFixed(4);
    const ffmpegInputs = selectedStems.flatMap((stem) => ['-i', path.join(cacheTrackDir, `${stem.slug}.mp3`)]);
    const countInSilenceSeconds = getCountInSilenceSeconds(selectedTrack);

    if (!args.keepCountIn) {
      if (countInSilenceSeconds !== null) {
        logInfo(
          `Muting first ${COUNT_IN_BARS_TO_MUTE} bar (~${countInSilenceSeconds.toFixed(2)}s at ${selectedTrack.tempo.bpm} BPM) in backing mix output.`,
        );
      } else {
        logWarning('Track BPM is missing/invalid; skipping automatic first-bar count-in mute for backing mix output.');
      }
    } else {
      logInfo('Leaving count-in audible in backing mix output (--keep-count-in).');
    }

    const filterParts = selectedStems.map((_, index) => `[${index}]volume=${volumeScale}[a${index}]`);
    const mixInputs = selectedStems.map((_, index) => `[a${index}]`).join('');
    const countInMuteFilter = (!args.keepCountIn && countInSilenceSeconds !== null)
      ? `,volume=0:enable='lt(t,${countInSilenceSeconds.toFixed(3)})'`
      : '';
    const filterComplex = [
      ...filterParts,
      `${mixInputs}amix=inputs=${stemCount}:normalize=0${countInMuteFilter},alimiter=limit=0.95:attack=5:release=50[out]`,
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

      const backingDurationSeconds = await getAudioDurationSeconds(backingOut);
      const clickDurationSeconds = await getAudioDurationSeconds(clickOut);
      const durationDelta = Math.abs(backingDurationSeconds - clickDurationSeconds);

      if (durationDelta <= DURATION_MATCH_TOLERANCE_SECONDS) {
        logInfo(
          `Duration validation passed: backing=${backingDurationSeconds.toFixed(3)}s, click=${clickDurationSeconds.toFixed(3)}s.`,
        );
      } else {
        logWarning(
          `Duration validation failed: backing=${backingDurationSeconds.toFixed(3)}s, click=${clickDurationSeconds.toFixed(3)}s (delta=${durationDelta.toFixed(3)}s).`,
        );
      }
    }

    logInfo(`Mix outputs directory: ${outputTrackDir}`);
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

export function addSharedDownloadMixOptions(command: Command, defaultOutputDir: string = 'downloads'): Command {
  return command
    .option('-s, --search <text>', 'Search by slug/artist/title text')
    .option('-u, --username <name>', 'Filter tracks by owning username')
    .option('--slug <slug>', 'Select an exact track slug without prompting')
    .option('-o, --output <dir>', 'Target root directory', defaultOutputDir)
    .option('-l, --limit <n>', 'Max search results shown (default: 25, max: 100)', parsePositiveInt, 25);
}

export function registerAudioCommands(program: Command): void {
  addSharedDownloadMixOptions(
    program.command('download').description('Search tracks and download available files from Azure Blob Storage.'),
    'downloads',
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runDownload(toCliArgs(options));
  });

  addSharedDownloadMixOptions(
    program.command('mix').description('Create local WAV mixes from downloaded stem files via ffmpeg.'),
    'mixes',
  ).option(
    '--keep-count-in',
    'Keep first-bar count-in audible in backing output (default mutes first bar).',
    false,
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number; keepCountIn?: boolean }) => {
    await runMix(toCliArgs(options));
  });
}

export function registerTrackAudioAliases(track: Command): void {
  addSharedDownloadMixOptions(
    track.command('download').description('Shorthand for: kvd download'),
    'downloads',
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number }) => {
    await runDownload(toCliArgs(options));
  });

  addSharedDownloadMixOptions(
    track.command('mix').description('Shorthand for: kvd mix'),
    'mixes',
  ).option(
    '--keep-count-in',
    'Keep first-bar count-in audible in backing output (default mutes first bar).',
    false,
  ).action(async (options: { search?: string; username?: string; slug?: string; output?: string; limit?: number; keepCountIn?: boolean }) => {
    await runMix(toCliArgs(options));
  });
}
