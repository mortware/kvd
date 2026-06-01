#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { spawn } from 'child_process';
import { stdin as input, stdout as output } from 'process';
import { Command } from 'commander';
import blob from './data/blob';
import db from './data/db';
import {
  compareCatalog,
  createAccount,
  getImportStatus,
  getStoredTrack,
  getStoredTracks,
  ImportMode,
  importTrack,
  refreshImportStatus,
  kvGetLyrics,
  kvGetPurchases,
  listAccounts,
  queryTracks,
  updateLyrics,
} from './features';
import { Track, TrackImportStatus } from './types';
import { logError, logInfo, logWarning } from './lib/logger';

type CliArgs = {
  search?: string;
  username?: string;
  outputDir: string;
  limit: number;
  slug?: string;
};

type FileManifestItem = {
  blobPath: string;
  displayName: string;
  status: string;
  kind: 'full-mix' | 'stem' | 'mix' | 'blob-only';
  available: boolean;
};

type TableColumn<T> = {
  header: string;
  width: number;
  align?: 'left' | 'right';
  value: (row: T, index: number) => string;
};

const ansi = {
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
};

const ansiPattern = /\x1B\[[0-9;]*m/g;

function toCliArgs(options: {
  search?: string;
  username?: string;
  slug?: string;
  output?: string;
  limit?: number;
}): CliArgs {
  const parsedLimit = options.limit ?? 25;

  if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
    throw new Error(`Invalid --limit value: ${parsedLimit}`);
  }

  return {
    search: options.search,
    username: options.username,
    slug: options.slug,
    outputDir: path.resolve(process.cwd(), options.output ?? 'downloads'),
    limit: Math.min(parsedLimit, 100),
  };
}

function parsePositiveInt(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error(`Invalid positive integer: ${value}`);
  }

  return parsed;
}

function parseBooleanInput(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

function parseTrackStatus(value: string | undefined): TrackImportStatus | undefined {
  if (!value) {
    return undefined;
  }

  if (value === 'pending' || value === 'partial' || value === 'complete' || value === 'error') {
    return value;
  }

  throw new Error(`Invalid --status value: ${value}`);
}

function parseImportMode(value: string | undefined): ImportMode {
  if (value === 'import-missing' || value === 'update' || value === 'overwrite') {
    return value;
  }

  throw new Error(`Invalid import mode: ${value}. Use one of: import-missing, update, overwrite`);
}

async function promptTrackImportMode(): Promise<ImportMode | null> {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('');
    console.log('Track import actions:');
    console.log('  1. import-missing  (import only missing metadata/assets)');
    console.log('  2. update          (refresh metadata + import missing assets)');
    console.log('  3. overwrite       (refresh metadata + overwrite all assets)');
    console.log('  4. cancel');

    const actionInput = (await rl.question('Choose an action [1-4]: ')).trim();

    if (actionInput === '1') {
      return 'import-missing';
    }

    if (actionInput === '2') {
      return 'update';
    }

    if (actionInput === '3') {
      return 'overwrite';
    }

    return null;
  } finally {
    rl.close();
  }
}

function summarizeOwners(users: string[] | undefined): string {
  const owners = users ?? [];

  if (owners.length === 0) {
    return 'none';
  }

  if (owners.length === 1) {
    return owners[0] || 'none';
  }

  const first = owners[0] || 'unknown';
  return `${first} + ${owners.length - 1} others`;
}

function isImportedAssetStatus(status: string | undefined): boolean {
  return status === 'imported' || status === 'synced';
}

function computeImportItemSummary(track: Track): { imported: number; total: number } {
  const total = 1 + (track.stems?.length ?? 0) + (track.mixes?.length ?? 0);
  const imported =
    (isImportedAssetStatus(track.fullMix?.status) ? 1 : 0) +
    (track.stems?.filter((stem) => isImportedAssetStatus(stem.status)).length ?? 0) +
    (track.mixes?.filter((mix) => isImportedAssetStatus(mix.status)).length ?? 0);

  return { imported, total };
}

function stripAnsi(value: string): string {
  return value.replace(ansiPattern, '');
}

function visibleLength(value: string): number {
  return stripAnsi(value).length;
}

function pad(value: string, width: number, align: 'left' | 'right' = 'left'): string {
  const rawValue = stripAnsi(value);
  const valueVisibleLength = visibleLength(value);

  if (valueVisibleLength === width) {
    return value;
  }

  if (valueVisibleLength > width) {
    return `${rawValue.slice(0, Math.max(width - 3, 0))}${width > 2 ? '...' : ''}`;
  }

  const remaining = width - valueVisibleLength;

  if (align === 'right') {
    return `${' '.repeat(remaining)}${value}`;
  }

  return `${value}${' '.repeat(remaining)}`;
}

function colorizeType(kind: FileManifestItem['kind']): string {
  if (kind === 'full-mix') {
    return ansi.cyan(kind);
  }

  if (kind === 'stem') {
    return ansi.green(kind);
  }

  if (kind === 'mix') {
    return ansi.yellow(kind);
  }

  return ansi.magenta(kind);
}

function formatMixDisplayName(name: string): string {
  if (/^play\s*along\b/i.test(name)) {
    return name;
  }

  return `Play Along ${name}`;
}

function renderTable<T>(rows: T[], columns: TableColumn<T>[]): string {
  const header = columns.map((column) => pad(column.header, column.width)).join(' | ');
  const separator = columns.map((column) => '-'.repeat(column.width)).join('-+-');
  const body = rows.map((row, index) => {
    return columns
      .map((column) => pad(column.value(row, index), column.width, column.align ?? 'left'))
      .join(' | ');
  });

  return [header, separator, ...body].join('\n');
}

function normalizeStatus(status: string | undefined): string {
  return status ?? 'unknown';
}

function parseMultiSelect(inputValue: string, max: number): number[] {
  const trimmed = inputValue.trim().toLowerCase();
  if (trimmed === '' || trimmed === 'all') {
    return Array.from({ length: max }, (_, index) => index + 1);
  }

  const selected = new Set<number>();
  const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startRaw, endRaw] = part.split('-');
      const start = Number.parseInt(startRaw ?? '', 10);
      const end = Number.parseInt(endRaw ?? '', 10);
      if (Number.isNaN(start) || Number.isNaN(end)) {
        continue;
      }

      const low = Math.min(start, end);
      const high = Math.max(start, end);

      for (let i = low; i <= high; i += 1) {
        if (i >= 1 && i <= max) {
          selected.add(i);
        }
      }
      continue;
    }

    const value = Number.parseInt(part, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= max) {
      selected.add(value);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}

async function chooseTrack(tracks: Track[], rl: readline.Interface): Promise<Track | null> {
  if (tracks.length === 0) {
    return null;
  }

  console.log('');
  console.log('Matching tracks:');
  console.log(renderTable(tracks, [
    {
      header: '#',
      width: 3,
      align: 'right',
      value: (_track, index) => `${index + 1}`,
    },
    {
      header: 'Artist',
      width: 24,
      value: (track) => track.artist,
    },
    {
      header: 'Title',
      width: 28,
      value: (track) => track.title,
    },
    {
      header: 'Slug',
      width: 32,
      value: (track) => track.slug,
    },
    {
      header: 'Status',
      width: 9,
      value: (track) => normalizeStatus(track.status),
    },
  ]));

  const selectedText = await rl.question('Choose a track number: ');
  const selectedIndex = Number.parseInt(selectedText.trim(), 10) - 1;
  if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= tracks.length) {
    return null;
  }

  return tracks[selectedIndex] ?? null;
}

async function searchTracks(args: CliArgs, rl: readline.Interface): Promise<Track[]> {
  let search = args.search;
  if (!search && !args.slug) {
    search = (await rl.question('Search songs (artist/title/slug): ')).trim();
  }

  const tracks = await db.tracks.query({
    search: search || undefined,
    username: args.username,
    sortBy: 'artist',
    sortDirection: 'asc',
    limit: args.limit,
  });

  return tracks;
}

function buildExpectedManifest(track: Track): FileManifestItem[] {
  const manifest: FileManifestItem[] = [];

  manifest.push({
    blobPath: `${track.slug}/full-mix.mp3`,
    displayName: 'Full Mix',
    status: normalizeStatus(track.fullMix?.status),
    kind: 'full-mix',
    available: false,
  });

  for (const stem of track.stems ?? []) {
    manifest.push({
      blobPath: `${track.slug}/${stem.slug}.mp3`,
      displayName: stem.name,
      status: normalizeStatus(stem.status),
      kind: 'stem',
      available: false,
    });
  }

  for (const mix of track.mixes ?? []) {
    manifest.push({
      blobPath: `${track.slug}/${mix.slug}.mp3`,
      displayName: formatMixDisplayName(mix.name),
      status: normalizeStatus(mix.status),
      kind: 'mix',
      available: false,
    });
  }

  return manifest;
}

async function buildManifest(track: Track): Promise<FileManifestItem[]> {
  const expected = buildExpectedManifest(track);
  const actualBlobPaths = await blob.listFiles(`${track.slug}/`);
  const actualSet = new Set(actualBlobPaths);

  const merged: FileManifestItem[] = expected.map((entry) => ({
    ...entry,
    available: actualSet.has(entry.blobPath),
  }));

  const expectedSet = new Set(expected.map((entry) => entry.blobPath));
  for (const blobPath of actualBlobPaths) {
    if (!expectedSet.has(blobPath)) {
      merged.push({
        blobPath,
        displayName: path.basename(blobPath, path.extname(blobPath)),
        status: 'imported',
        kind: 'blob-only',
        available: true,
      });
    }
  }

  return merged;
}

function printManifest(manifest: FileManifestItem[]) {
  console.log('');
  console.log('Available and expected files:');
  console.log(renderTable(manifest, [
    {
      header: '#',
      width: 3,
      align: 'right',
      value: (_item, index) => `${index + 1}`,
    },
    {
      header: 'Type',
      width: 10,
      value: (item) => colorizeType(item.kind),
    },
    {
      header: 'Name',
      width: 36,
      value: (item) => item.displayName,
    },
    {
      header: 'Status',
      width: 9,
      value: (item) => item.status,
    },
    {
      header: 'Available',
      width: 9,
      value: (item) => (item.available ? 'yes' : 'no'),
    },
  ]));
}

async function chooseFiles(manifest: FileManifestItem[], rl: readline.Interface): Promise<FileManifestItem[]> {
  if (manifest.length === 0) {
    return [];
  }

  printManifest(manifest);

  const inputValue = await rl.question('Select files (all, 1,2,5-7): ');
  const selectedIndexes = parseMultiSelect(inputValue, manifest.length);

  return selectedIndexes
    .map((index) => manifest[index - 1])
    .filter((item): item is FileManifestItem => Boolean(item));
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    proc.on('error', (err) => reject(new Error(`Failed to start ffmpeg: ${err.message}`)));
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}:\n${stderr.slice(-800)}`));
      }
    });
  });
}

async function ensureLocalFile(blobPath: string, localPath: string): Promise<void> {
  try {
    await fs.promises.access(localPath);
  } catch {
    await fs.promises.mkdir(path.dirname(localPath), { recursive: true });
    await blob.downloadToFile(blobPath, localPath);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function promptYesNo(
  rl: readline.Interface,
  question: string,
  defaultValue: boolean = false,
): Promise<boolean> {
  const suffix = defaultValue ? ' [Y/n]: ' : ' [y/N]: ';
  const answer = (await rl.question(`${question}${suffix}`)).trim().toLowerCase();

  if (answer === '') {
    return defaultValue;
  }

  return answer === 'y' || answer === 'yes';
}

async function runMix(args: CliArgs) {
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

async function runDownload(args: CliArgs) {
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

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

async function runAccountList(): Promise<void> {
  const accounts = await listAccounts();

  if (accounts.length === 0) {
    logInfo('No accounts found.');
    return;
  }

  console.log(renderTable(accounts, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Username', width: 24, value: (row) => row.username },
    { header: 'Name', width: 28, value: (row) => row.name ?? '' },
  ]));
}

async function promptForAccountUsername(promptText: string): Promise<string> {
  const accounts = await listAccounts();

  if (accounts.length === 0) {
    throw new Error('No accounts found. Create one first with: kvd account create --username <name> --password <password>');
  }

  console.log('');
  console.log('Available accounts:');
  console.log(renderTable(accounts, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Username', width: 24, value: (row) => row.username },
    { header: 'Name', width: 28, value: (row) => row.name ?? '' },
  ]));

  const rl = readline.createInterface({ input, output });

  try {
    const selectedText = await rl.question(`${promptText} `);
    const selectedIndex = Number.parseInt(selectedText.trim(), 10) - 1;

    if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= accounts.length) {
      throw new Error('Invalid account selection.');
    }

    const selectedAccount = accounts[selectedIndex];
    if (!selectedAccount) {
      throw new Error('Invalid account selection.');
    }

    return selectedAccount.username;
  } finally {
    rl.close();
  }
}

async function resolveUsernameOption(username: string | undefined, promptText: string): Promise<string> {
  if (username && username.trim() !== '') {
    return username;
  }

  logInfo('No --username provided. Please choose an account.');
  return promptForAccountUsername(promptText);
}

async function runAccountCreate(options: { username: string; password: string; name?: string }): Promise<void> {
  const result = await createAccount({
    username: options.username,
    password: options.password,
    name: options.name,
  });
  printJson(result);
}

async function runAccountImport(options: {
  username?: string;
  useCache?: boolean;
  refresh?: boolean;
  action?: string;
  claimShared?: boolean;
}): Promise<void> {
  await runCompareCatalog(options);
}

async function runPurchases(options: { username: string; skipCache?: boolean }): Promise<void> {
  const result = await kvGetPurchases({ username: options.username, skipCache: options.skipCache ?? false });
  console.log(result.cached
    ? `Using cached catalog from ${result.fetchedAt.toISOString()}`
    : `Fetched fresh catalog at ${result.fetchedAt.toISOString()}`,
  );
  printJson({
    trackCount: result.tracks.length,
    cached: result.cached,
    cacheAgeHours: result.cacheAgeHours,
    fetchedAt: result.fetchedAt,
    tracks: result.tracks,
  });
}

type NeedsImportRow = {
  sourceId: string;
  slug: string;
  artist: string;
  title: string;
  status: 'pending' | 'partial' | 'error';
};

type SharedTrackRow = {
  sourceId: string;
  slug: string;
  artist: string;
  title: string;
  users: string;
  status: 'pending' | 'partial' | 'complete' | 'error';
};

type SharedTrackClaimCandidate = {
  track: Track;
  sourceId: string;
};

type CatalogImportActionMode = 'prompt' | 'import-missing' | 'update' | 'overwrite' | 'none';

function normalizeCatalogImportActionMode(action: string | undefined): CatalogImportActionMode {
  if (!action) {
    return 'prompt';
  }

  if (action === 'prompt' || action === 'import-missing' || action === 'update' || action === 'overwrite' || action === 'none') {
    return action;
  }

  throw new Error(`Invalid --action value: ${action}. Use one of: prompt, import-missing, update, overwrite, none`);
}

async function promptCatalogImportAction(): Promise<CatalogImportActionMode> {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('');
    console.log('Post-validation actions:');
    console.log('  1. Import missing tracks (default)');
    console.log('  2. Update all comparable tracks (metadata + missing assets)');
    console.log('  3. Overwrite all comparable tracks (metadata + all assets)');
    console.log('  4. No action');

    const actionInput = (await rl.question('Choose an action [1-4]: ')).trim();

    if (actionInput === '1') {
      return 'import-missing';
    }

    if (actionInput === '2') {
      return 'update';
    }

    if (actionInput === '3') {
      return 'overwrite';
    }

    return 'none';
  } finally {
    rl.close();
  }
}

async function runCompareCatalog(options: {
  username?: string;
  useCache?: boolean;
  refresh?: boolean;
  action?: string;
  claimShared?: boolean;
}): Promise<void> {
  const username = await resolveUsernameOption(options.username, 'Choose an account number for account import:');
  const skipCache = options.useCache ? false : true;
  const comparison = await compareCatalog(username, { skipCache: options.refresh ? true : skipCache });

  const dbTracks = await db.tracks.listByUser(username);
  const dbBySourceId = new Map(dbTracks.map((track) => [String(track.source.id), track]));
  const allDbTracks = await db.tracks.list();
  const globalDbBySourceId = new Map(allDbTracks.map((track) => [String(track.source.id), track]));
  const sharedTrackClaimCandidates: SharedTrackClaimCandidate[] = [];

  let sharedTracks: SharedTrackRow[] = comparison.onlyOnWebsite
    .map((item) => {
      const dbTrack = globalDbBySourceId.get(String(item.sourceId));
      if (!dbTrack || dbBySourceId.has(String(item.sourceId))) {
        return null;
      }

      sharedTrackClaimCandidates.push({
        track: dbTrack,
        sourceId: String(item.sourceId),
      });

      return {
        sourceId: String(item.sourceId),
        slug: dbTrack.slug,
        artist: dbTrack.artist,
        title: dbTrack.title,
        users: (dbTrack.source.users || []).join(', '),
        status: dbTrack.status ?? 'pending',
      };
    })
    .filter((item): item is SharedTrackRow => Boolean(item));

  if (options.claimShared && sharedTrackClaimCandidates.length > 0) {
    let claimedCount = 0;

    for (const candidate of sharedTrackClaimCandidates) {
      const existingUsers = candidate.track.source?.users ?? [];
      if (existingUsers.includes(username)) {
        continue;
      }

      const updatedTrack: Track = {
        ...candidate.track,
        source: {
          ...candidate.track.source,
          users: [...existingUsers, username],
        },
        updated: new Date(),
      };

      await db.tracks.update(candidate.track.id, candidate.track.slug, updatedTrack);
      dbBySourceId.set(candidate.sourceId, updatedTrack);
      globalDbBySourceId.set(candidate.sourceId, updatedTrack);
      claimedCount += 1;
    }

    if (claimedCount > 0) {
      logInfo(`Claimed ${claimedCount} shared track(s) for account '${username}'.`);
    }
  }

  sharedTracks = comparison.onlyOnWebsite
    .map((item) => {
      const dbTrack = globalDbBySourceId.get(String(item.sourceId));
      if (!dbTrack || dbBySourceId.has(String(item.sourceId))) {
        return null;
      }

      return {
        sourceId: String(item.sourceId),
        slug: dbTrack.slug,
        artist: dbTrack.artist,
        title: dbTrack.title,
        users: (dbTrack.source.users || []).join(', '),
        status: dbTrack.status ?? 'pending',
      };
    })
    .filter((item): item is SharedTrackRow => Boolean(item));

  const notImported = comparison.onlyOnWebsite.filter((item) => !globalDbBySourceId.has(String(item.sourceId)));

  const needsImport: NeedsImportRow[] = [];
  const importableMatches = [
    ...comparison.inBoth.map((item) => ({ sourceId: String(item.sourceId), kind: 'owned' as const })),
    ...sharedTracks.map((item) => ({ sourceId: String(item.sourceId), kind: 'shared' as const })),
  ];

  for (const match of importableMatches) {
    const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
    if (!dbTrack) {
      continue;
    }

    const status = dbTrack.status ?? 'pending';
    if (status === 'complete') {
      continue;
    }

    needsImport.push({
      sourceId: match.sourceId,
      slug: dbTrack.slug,
      artist: dbTrack.artist,
      title: dbTrack.title,
      status,
    });
  }

  const completeRows = importableMatches.filter((match) => {
    const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
    return (dbTrack?.status ?? 'pending') === 'complete';
  });

  const totalCatalogTracks = comparison.inBoth.length + sharedTracks.length + notImported.length;
  const totalNeedsImport = totalCatalogTracks - completeRows.length;

  console.log('');
  console.log(`Catalog import validation for '${username}'${(options.refresh || !options.useCache) ? ' (fresh website fetch)' : ' (cache allowed)'}:`);
  console.log(renderTable([
    {
      totalCatalogTracks,
      completeTracks: completeRows.length,
      needsImportTracks: totalNeedsImport,
    },
  ], [
    { header: 'Catalog Total', width: 13, align: 'right', value: (row) => `${row.totalCatalogTracks}` },
    { header: 'Complete', width: 8, align: 'right', value: (row) => `${row.completeTracks}` },
    { header: 'Needs Import', width: 12, align: 'right', value: (row) => `${row.needsImportTracks}` },
  ]));

  console.log('');
  console.log(`On website and in DB: ${comparison.inBoth.length + sharedTracks.length}`);
  console.log(`In DB but owned by other accounts: ${sharedTracks.length}`);
  console.log(`On website only (not imported): ${notImported.length}`);
  console.log(`In DB only: ${comparison.onlyInDatabase.length}`);
  console.log(`In DB but not fully imported: ${needsImport.length}`);

  if (sharedTracks.length > 0) {
    console.log('');
    console.log('Tracks already in DB but linked to other accounts:');
    console.log(renderTable(sharedTracks, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Users', width: 28, value: (row) => row.users || '-' },
    ]));
  }

  if (needsImport.length > 0) {
    console.log('');
    console.log('Tracks not fully imported (import candidates):');
    console.log(renderTable(needsImport, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Artist', width: 22, value: (row) => row.artist },
      { header: 'Title', width: 24, value: (row) => row.title },
    ]));
  }

  if (notImported.length > 0) {
    console.log('');
    console.log('Tracks on website but not imported into DB:');
    console.log(renderTable(notImported, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Slug', width: 36, value: (row) => row.slug },
      { header: 'Artist', width: 22, value: (row) => row.artist },
      { header: 'Title', width: 24, value: (row) => row.title },
    ]));
  }

  const requestedAction = normalizeCatalogImportActionMode(options.action);
  let actionMode: CatalogImportActionMode = requestedAction;

  if (requestedAction === 'prompt') {
    actionMode = process.stdin.isTTY ? await promptCatalogImportAction() : 'none';
  }

  if (actionMode === 'none') {
    return;
  }

  const importCandidates = actionMode === 'update' || actionMode === 'overwrite'
    ? importableMatches
      .map((match) => {
        const dbTrack = (match.kind === 'owned' ? dbBySourceId : globalDbBySourceId).get(match.sourceId);
        if (!dbTrack) {
          return null;
        }

        return {
          slug: dbTrack.slug,
          status: dbTrack.status ?? 'pending',
        };
      })
      .filter((item): item is { slug: string; status: TrackImportStatus | 'pending' } => Boolean(item))
    : needsImport.map((item) => ({ slug: item.slug, status: item.status }));

  if (importCandidates.length === 0) {
    logInfo(actionMode === 'import-missing' ? 'No missing tracks found to import.' : 'No comparable DB tracks found to import.');
    return;
  }

  const importResults: Array<{ slug: string; beforeStatus: string; afterStatus: string; errors?: string[] }> = [];

  for (const candidate of importCandidates) {
    logInfo(`Importing: ${candidate.slug}`);
    try {
      const result = await importTrack({
        slug: candidate.slug,
        username,
        mode: parseImportMode(actionMode),
      });
      importResults.push({
        slug: candidate.slug,
        beforeStatus: candidate.status,
        afterStatus: result.importResult?.status ?? 'skipped',
        errors: result.importResult?.errors.length ? result.importResult.errors : undefined,
      });
    } catch (error) {
      importResults.push({
        slug: candidate.slug,
        beforeStatus: candidate.status,
        afterStatus: 'error',
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  const complete = importResults.filter((item) => item.afterStatus === 'complete').length;
  const failed = importResults.length - complete;

  console.log('');
  console.log(`Import summary (${actionMode}):`);
  printJson({
    selected: importResults.length,
    complete,
    failed,
    results: importResults,
  });
}

async function runTracks(options: { username: string }): Promise<void> {
  const tracks = await getStoredTracks(options.username);

  if (tracks.length === 0) {
    logInfo(`No tracks found for user '${options.username}'.`);
    return;
  }

  console.log(renderTable(tracks, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Artist', width: 24, value: (row) => row.artist },
    { header: 'Title', width: 28, value: (row) => row.title },
    { header: 'Slug', width: 32, value: (row) => row.slug },
    { header: 'Status', width: 10, value: (row) => row.status ?? 'pending' },
    { header: 'Stems', width: 5, align: 'right', value: (row) => `${row.stems}` },
    { header: 'Mixes', width: 5, align: 'right', value: (row) => `${row.mixes}` },
  ]));
}

async function runTrackGet(options: { slug: string }): Promise<void> {
  const result = await getStoredTrack({ slug: options.slug });
  printJson(result);
}

async function runTrackQuery(options: {
  search?: string;
  username?: string;
  status?: string;
  hasLyrics?: string;
  key?: string;
  tempoMin?: number;
  tempoMax?: number;
  sortBy?: 'artist' | 'title' | 'updated' | 'created';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}): Promise<void> {
  if (options.sortBy && !['artist', 'title', 'updated', 'created'].includes(options.sortBy)) {
    throw new Error(`Invalid --sort-by value: ${options.sortBy}`);
  }

  if (options.sortDirection && !['asc', 'desc'].includes(options.sortDirection)) {
    throw new Error(`Invalid --sort-direction value: ${options.sortDirection}`);
  }

  const result = await queryTracks({
    search: options.search,
    username: options.username,
    status: parseTrackStatus(options.status),
    hasLyrics: options.hasLyrics === undefined ? undefined : parseBooleanInput(options.hasLyrics),
    key: options.key,
    tempoMin: options.tempoMin,
    tempoMax: options.tempoMax,
    sortBy: options.sortBy,
    sortDirection: options.sortDirection,
    limit: options.limit,
  });

  if (result.tracks.length === 0) {
    logInfo('No tracks matched the query.');
    return;
  }

  console.log(renderTable(result.tracks, [
    { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
    { header: 'Artist', width: 24, value: (row) => row.artist },
    { header: 'Title', width: 28, value: (row) => row.title },
    { header: 'Slug', width: 32, value: (row) => row.slug },
    { header: 'Status', width: 9, value: (row) => row.status ?? 'pending' },
    { header: 'Key', width: 5, value: (row) => row.songKey ?? '' },
    {
      header: 'BPM',
      width: 5,
      align: 'right',
      value: (row) => (row.tempo?.bpm !== undefined ? `${row.tempo.bpm}` : ''),
    },
    {
      header: 'Lyrics',
      width: 6,
      value: (row) => (row.lyrics ? 'yes' : 'no'),
    },
  ]));

  logInfo(`Returned ${result.count} track(s).`);
}

async function runTrackImport(options: {
  slug: string;
  username?: string;
  skipCache?: boolean;
  mode?: string;
}): Promise<void> {
  const existing = await db.tracks.find(options.slug);

  console.log('');
  console.log('Track import target:');

  if (existing) {
    const itemSummary = computeImportItemSummary(existing);
    console.log(renderTable([existing], [
      { header: 'Slug', width: 32, value: (row) => row.slug },
      { header: 'Artist', width: 24, value: (row) => row.artist },
      { header: 'Title', width: 28, value: (row) => row.title },
      { header: 'Status', width: 9, value: (row) => row.status ?? 'pending' },
      { header: 'Owners', width: 26, value: (row) => summarizeOwners(row.source?.users) },
      {
        header: 'Items',
        width: 9,
        align: 'right',
        value: () => `${itemSummary.imported}/${itemSummary.total}`,
      },
    ]));

    if ((existing.source?.users ?? []).length > 0) {
      console.log(`Accounts: ${(existing.source.users ?? []).join(', ')}`);
    }
  } else {
    console.log(`- slug: ${options.slug}`);
    console.log('- status: not found in database (will import as new)');
  }

  let username = options.username?.trim();
  if (!username || username === '') {
    if ((existing?.source?.users?.length ?? 0) > 0) {
      username = existing?.source?.users?.[0] ?? '';
      logInfo(`No --username provided. Using first owning account: ${username}`);
    } else {
      username = await resolveUsernameOption(undefined, 'Choose an account number for track import:');
    }
  }

  let mode: ImportMode;
  if (options.mode) {
    mode = parseImportMode(options.mode);
  } else if (process.stdin.isTTY) {
    const selectedMode = await promptTrackImportMode();
    if (!selectedMode) {
      logInfo('Track import cancelled.');
      return;
    }
    mode = selectedMode;
  } else {
    mode = 'import-missing';
    logInfo('No --mode provided in non-interactive context. Defaulting to import-missing.');
  }

  logInfo(`Importing track '${options.slug}' with mode '${mode}' as account '${username}'.`);

  const result = await importTrack({
    slug: options.slug,
    username,
    skipCache: options.skipCache,
    mode,
  });

  printJson(result);
}

async function runTrackImportStatus(options: { username: string; details?: boolean }): Promise<void> {
  const result = await getImportStatus(options.username);

  console.log(
    `Import status for ${result.username}: ` +
    `${result.complete}/${result.totalTracks} complete (${result.percentComplete}%) | ` +
    `partial: ${result.partial}, pending: ${result.pending}, error: ${result.error}`,
  );

  if (options.details && result.tracks.length > 0) {
    console.log('');
    console.log(renderTable(result.tracks, [
      { header: '#', width: 3, align: 'right', value: (_row, i) => `${i + 1}` },
      { header: 'Artist', width: 24, value: (row) => row.artist },
      { header: 'Title', width: 28, value: (row) => row.title },
      { header: 'Slug', width: 32, value: (row) => row.slug },
      { header: 'Status', width: 9, value: (row) => row.status },
      { header: 'Imported', width: 8, align: 'right', value: (row) => `${row.importedItems}` },
      { header: 'Total', width: 8, align: 'right', value: (row) => `${row.totalItems}` },
    ]));
  }
}

async function runTrackRefreshImportStatus(options: { username: string }): Promise<void> {
  const result = await refreshImportStatus(options.username);
  printJson(result);
}

async function runLyricsGet(options: { slug: string }): Promise<void> {
  const result = await kvGetLyrics({ slug: options.slug });
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

function addSharedDownloadMixOptions(command: Command): Command {
  return command
    .option('-s, --search <text>', 'Search by slug/artist/title text')
    .option('-u, --username <name>', 'Filter tracks by owning username')
    .option('--slug <slug>', 'Select an exact track slug without prompting')
    .option('-o, --output <dir>', 'Target root directory', 'downloads')
    .option('-l, --limit <n>', 'Max search results shown (default: 25, max: 100)', parsePositiveInt, 25);
}

function buildProgram(): Command {
  const program = new Command();

  program
    .name('kvd')
    .description('CLI for managing karaoke-version track catalog imports, assets, and downloads')
    .showHelpAfterError()
    .configureOutput({
      outputError: (str, write) => write(str),
    });

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

  const account = program.command('account').description('Account operations');

  account
    .command('list')
    .description('List all stored karaoke-version accounts')
    .action(async () => {
      await runAccountList();
    });

  account
    .command('create')
    .description('Create a karaoke-version account entry in CosmosDB')
    .requiredOption('--username <name>', 'Account username')
    .requiredOption('--password <password>', 'Account password')
    .option('--name <displayName>', 'Optional display name')
    .action(async (options: { username: string; password: string; name?: string }) => {
      await runAccountCreate(options);
    });

  account
    .command('import')
    .description('Validate account catalog and optionally import missing tracks')
    .option('--username <name>', 'Account username')
    .option('--use-cache', 'Allow cached website catalog (default: fetch fresh)', false)
    .option('--refresh', 'Force fresh website catalog fetch (same as default)', false)
    .option('--claim-shared', 'Add this username to tracks already present in DB under other accounts', false)
    .option('--action <mode>', 'prompt | import-missing | update | overwrite | none', 'prompt')
    .action(async (options: {
      username?: string;
      useCache?: boolean;
      refresh?: boolean;
      action?: string;
      claimShared?: boolean;
    }) => {
      await runAccountImport(options);
    });

  const catalog = program.command('catalog').description('Catalog and source website operations');

  catalog
    .command('purchases')
    .description('Fetch purchased tracks from karaoke-version (supports account catalog cache)')
    .requiredOption('--username <name>', 'Account username')
    .option('--skip-cache', 'Force refresh from website', false)
    .action(async (options: { username: string; skipCache?: boolean }) => {
      await runPurchases(options);
    });

  const track = program.command('track').description('Track listing, query, import, and local audio operations');

  track
    .command('list')
    .description('List stored tracks for one account')
    .requiredOption('--username <name>', 'Account username')
    .action(async (options: { username: string }) => {
      await runTracks(options);
    });

  track
    .command('get')
    .description('Get a single stored track by slug')
    .requiredOption('--slug <slug>', 'Track slug')
    .action(async (options: { slug: string }) => {
      await runTrackGet(options);
    });

  track
    .command('query')
    .description('Query tracks with filters for search, import status, lyrics, key, tempo, and sorting')
    .option('--search <text>', 'Search in slug')
    .option('--username <name>', 'Filter by owning user')
    .option('--status <status>', 'pending | partial | complete | error')
    .option('--has-lyrics <bool>', 'true | false')
    .option('--key <key>', 'Musical key (e.g. C, Am, F#)')
    .option('--tempo-min <n>', 'Minimum BPM', parsePositiveInt)
    .option('--tempo-max <n>', 'Maximum BPM', parsePositiveInt)
    .option('--sort-by <field>', 'artist | title | updated | created')
    .option('--sort-direction <dir>', 'asc | desc')
    .option('--limit <n>', 'Max results (default: 50, max: 100)', parsePositiveInt)
    .action(async (options: {
      search?: string;
      username?: string;
      status?: string;
      hasLyrics?: string;
      key?: string;
      tempoMin?: number;
      tempoMax?: number;
      sortBy?: 'artist' | 'title' | 'updated' | 'created';
      sortDirection?: 'asc' | 'desc';
      limit?: number;
    }) => {
      await runTrackQuery(options);
    });

  track
    .command('import')
    .description('Import one track metadata and assets from karaoke-version')
    .requiredOption('--slug <slug>', 'Track slug')
    .option('--username <name>', 'Account username (optional if slug already exists in DB)')
    .option('--skip-cache', 'Force refresh purchases before import', false)
    .option('--mode <mode>', 'import-missing | update | overwrite')
    .action(async (options: {
      slug: string;
      username?: string;
      skipCache?: boolean;
      mode?: string;
    }) => {
      await runTrackImport(options);
    });

  track
    .command('import-status')
    .description('Show import completion summary for a user')
    .requiredOption('--username <name>', 'Account username')
    .option('--details', 'Show per-track rows', false)
    .action(async (options: { username: string; details?: boolean }) => {
      await runTrackImportStatus(options);
    });

  track
    .command('refresh-status')
    .description('Recalculate track import statuses by checking blob existence')
    .requiredOption('--username <name>', 'Account username')
    .action(async (options: { username: string }) => {
      await runTrackRefreshImportStatus(options);
    });

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

  return program;
}

async function main() {
  const program = buildProgram();
  await program.parseAsync(process.argv);
}

main()
  .catch((error) => {
    logError('kvd CLI failed:', (error as Error).message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
