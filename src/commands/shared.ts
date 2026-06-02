import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { spawn } from 'child_process';
import { stdin as input, stdout as output } from 'process';
import { checkbox, select } from '@inquirer/prompts';
import blob from '../data/blob';
import db from '../data/db';
import { ImportMode } from '../features';
import { listAccounts } from '../integrations/kv';
import { Track, TrackImportStatus } from '../types';
import { logInfo } from '../lib/logger';

export type CliArgs = {
  search?: string;
  username?: string;
  outputDir: string;
  limit: number;
  slug?: string;
  keepCountIn?: boolean;
  mp3?: boolean;
  includeClickTrack?: boolean;
};

export type FileManifestItem = {
  blobPath: string;
  displayName: string;
  status: string;
  kind: 'full-mix' | 'stem' | 'mix' | 'blob-only';
  available: boolean;
};

export type TableColumn<T> = {
  header: string;
  width: number;
  align?: 'left' | 'right';
  value: (row: T, index: number) => string;
};

export type CatalogImportActionMode = 'prompt' | 'import-missing' | 'update' | 'overwrite' | 'none';

const ansi = {
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
};

const ansiPattern = /\x1B\[[0-9;]*m/g;

export function toCliArgs(options: {
  search?: string;
  username?: string;
  slug?: string;
  output?: string;
  limit?: number;
  keepCountIn?: boolean;
  mp3?: boolean;
  includeClickTrack?: boolean;
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
    keepCountIn: options.keepCountIn ?? false,
    mp3: options.mp3 ?? false,
    includeClickTrack: options.includeClickTrack ?? false,
  };
}

export function parsePositiveInt(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error(`Invalid positive integer: ${value}`);
  }

  return parsed;
}

export function parseBooleanInput(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

export function parseTrackStatus(value: string | undefined): TrackImportStatus | undefined {
  if (!value) {
    return undefined;
  }

  if (value === 'pending' || value === 'partial' || value === 'complete' || value === 'error') {
    return value;
  }

  throw new Error(`Invalid --status value: ${value}`);
}

export function parseImportMode(value: string | undefined): ImportMode {
  if (value === 'import-missing' || value === 'update' || value === 'overwrite') {
    return value;
  }

  throw new Error(`Invalid import mode: ${value}. Use one of: import-missing, update, overwrite`);
}

export async function promptTrackImportMode(): Promise<ImportMode | null> {
  if (process.stdin.isTTY) {
    const selectedMode = await select<ImportMode | null>({
      message: 'Track import action',
      pageSize: 8,
      choices: [
        {
          value: 'import-missing',
          name: 'import-missing  (import only missing metadata/assets)',
        },
        {
          value: 'update',
          name: 'update          (refresh metadata + import missing assets)',
        },
        {
          value: 'overwrite',
          name: 'overwrite       (refresh metadata + overwrite all assets)',
        },
        {
          value: null,
          name: 'cancel',
        },
      ],
    });

    return selectedMode;
  }

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

export function summarizeOwners(users: string[] | undefined): string {
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

export function computeImportItemSummary(track: Track): { imported: number; total: number } {
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

export function renderTable<T>(rows: T[], columns: TableColumn<T>[]): string {
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

export function parseMultiSelect(inputValue: string, max: number): number[] {
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

export async function chooseTrack(tracks: Track[], rl: readline.Interface): Promise<Track | null> {
  if (tracks.length === 0) {
    return null;
  }

  if (process.stdin.isTTY) {
    const selectedIndex = await select<number | null>({
      message: 'Choose a track',
      pageSize: Math.min(15, tracks.length + 1),
      choices: [
        ...tracks.map((track, index) => ({
          value: index,
          name: `${track.artist} - ${track.title}`,
          description: `${track.slug} | ${normalizeStatus(track.status)}`,
        })),
        {
          value: null,
          name: 'cancel',
        },
      ],
    });

    if (selectedIndex === null) {
      return null;
    }

    return tracks[selectedIndex] ?? null;
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

export async function searchTracks(args: CliArgs, rl: readline.Interface): Promise<Track[]> {
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

export async function buildManifest(track: Track): Promise<FileManifestItem[]> {
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

export async function chooseFiles(manifest: FileManifestItem[], rl: readline.Interface): Promise<FileManifestItem[]> {
  if (manifest.length === 0) {
    return [];
  }

  if (process.stdin.isTTY) {
    const selectedIndexes = await checkbox<number>({
      message: 'Select files to download',
      pageSize: Math.min(16, manifest.length + 2),
      choices: manifest.map((item, index) => ({
        value: index,
        name: `${item.displayName} [${item.kind}]`,
        description: `${item.blobPath} | status=${item.status}`,
        checked: item.available,
        disabled: item.available ? false : 'unavailable in blob',
      })),
    });

    return selectedIndexes
      .map((index) => manifest[index])
      .filter((item): item is FileManifestItem => Boolean(item));
  }

  printManifest(manifest);

  const inputValue = await rl.question('Select files (all, 1,2,5-7): ');
  const selectedIndexes = parseMultiSelect(inputValue, manifest.length);

  return selectedIndexes
    .map((index) => manifest[index - 1])
    .filter((item): item is FileManifestItem => Boolean(item));
}

export function runFfmpeg(args: string[]): Promise<void> {
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

export async function ensureLocalFile(blobPath: string, localPath: string): Promise<void> {
  try {
    await fs.promises.access(localPath);
  } catch {
    await fs.promises.mkdir(path.dirname(localPath), { recursive: true });
    await blob.downloadToFile(blobPath, localPath);
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function promptYesNo(
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

export function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

export async function promptForAccountUsername(promptText: string): Promise<string> {
  const accounts = await listAccounts();

  if (accounts.length === 0) {
    throw new Error('No accounts found. Create one first with: kvd account create --username <name> --password <password>');
  }

  if (process.stdin.isTTY) {
    return select<string>({
      message: promptText,
      pageSize: Math.min(12, accounts.length + 1),
      choices: accounts.map((account) => ({
        value: account.username,
        name: account.username,
        description: account.name ?? '',
      })),
    });
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

export async function resolveUsernameOption(username: string | undefined, promptText: string): Promise<string> {
  if (username && username.trim() !== '') {
    return username;
  }

  logInfo('No --username provided. Please choose an account.');
  return promptForAccountUsername(promptText);
}

export function normalizeCatalogImportActionMode(action: string | undefined): CatalogImportActionMode {
  if (!action) {
    return 'prompt';
  }

  if (action === 'prompt' || action === 'import-missing' || action === 'update' || action === 'overwrite' || action === 'none') {
    return action;
  }

  throw new Error(`Invalid --action value: ${action}. Use one of: prompt, import-missing, update, overwrite, none`);
}

export async function promptCatalogImportAction(): Promise<CatalogImportActionMode> {
  if (process.stdin.isTTY) {
    return select<CatalogImportActionMode>({
      message: 'Post-validation action',
      pageSize: 8,
      choices: [
        {
          value: 'import-missing',
          name: 'Import missing tracks',
          description: 'default safe behavior',
        },
        {
          value: 'update',
          name: 'Update all comparable tracks',
          description: 'refresh metadata + import missing assets',
        },
        {
          value: 'overwrite',
          name: 'Overwrite all comparable tracks',
          description: 'refresh metadata + overwrite assets',
        },
        {
          value: 'none',
          name: 'No action',
        },
      ],
    });
  }

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
