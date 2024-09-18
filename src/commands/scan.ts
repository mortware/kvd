import { CommandModule } from "yargs";
import db from "../data/db";
import { logDebug, logInfo, logWarning } from "../lib/logger";
import blob from "../data/blob";
import path from "path";
import { ImportRequest } from "../types";
import queue from "../data/queue";

export const scanCommand: CommandModule = {
  command: 'scan',
  describe: 'Scans all tracks and blobs for any anomalies',
  builder: (yargs) => {
    return yargs
      .help()
      .alias('help', 'h');
  },
  handler: async () => {

    //const dbReport = await getDbReport();
    const blobReport = await getBlobReport();

    //logInfo(JSON.stringify(dbReport, null, 2));
    logInfo(JSON.stringify(blobReport, null, 2));

    // for (const importRequest of dbReport.missingFolders) {
    //   logInfo(`Track is missing folder: ${importRequest.slug}. Queuing import.`);
    //   await queue.sendMessage('import', importRequest);
    //   break;
    // }
  }
}

async function getBlobReport() {

  type BlobReport = {
    orphanedFolders: Set<string>;
    orphanedFiles: Set<string>;
    totalFiles: number;
  }

  const report: BlobReport = {
    orphanedFolders: new Set(),
    orphanedFiles: new Set(),
    totalFiles: 0,
  }

  for await (const blobName of blob.listAllBlobs()) {
    report.totalFiles++;

    const folder = path.dirname(blobName);

    const track = await db.tracks.find(folder);
    if (!track) {
      report.orphanedFolders.add(folder);
      continue;
    }

    const slug = path.basename(blobName, '.mp3');

    const isInFullMix = track.fullMix?.slug === slug;
    const isInMixes = track.mixes?.some(mix => mix.slug === slug) ?? false;
    const isInStems = track.stems?.some(stem => stem.slug === slug) ?? false;

    if (!isInFullMix && !isInMixes && !isInStems) {
      report.orphanedFiles.add(blobName);
    }
  }
  return {
    ...report,
    orphanedFolders: Array.from(report.orphanedFolders),
    orphanedFiles: Array.from(report.orphanedFiles),
  }
}

async function getDbReport() {
  const tracks = await db.tracks.list();

  type DatabaseReport = {
    missingFolders: ImportRequest[],
    missingFullMix: ImportRequest[],
    missingStems: ImportRequest[],
    missingMixes: ImportRequest[],
    totalTracks: number,
  }

  const report: DatabaseReport = {
    missingFolders: [],
    missingFullMix: [],
    missingStems: [],
    missingMixes: [],
    totalTracks: tracks.length,
  }

  for (const track of tracks) {
    const hasFolder = await blob.checkFolderExists(track.slug);

    if (!hasFolder) {
      report.missingFolders.push({
        import: 'all',
        slug: track.slug
      });
      break;
    }

    // const hasFullMix = await blob.checkExists(path.join(track.slug, `full-mix.mp3`));
    // if (!hasFullMix) {
    //   report.missingFullMix.push({ id: track.id, slug: track.slug });
    // }

    // for (const mix of track.mixes ?? []) {
    //   const hasMix = await blob.checkExists(path.join(track.slug, `${mix.slug}.mp3`));
    //   if (!hasMix) {
    //     report.missingMixes.push({ trackId: track.id, trackSlug: track.slug, slug: mix.slug });
    //   }
    // }

    // for (const stem of track.stems ?? []) {
    //   const hasStem = await blob.checkExists(path.join(track.slug, `${stem.slug}.mp3`));
    //   if (!hasStem) {
    //     report.missingStems.push({ trackId: track.id, trackSlug: track.slug, slug: stem.slug });
    //   }
    // }
  }

  return {
    ...report,
    missingFolders: Array.from(report.missingFolders),
    missingFullMix: Array.from(report.missingFullMix),
    missingStems: Array.from(report.missingStems),
    missingMixes: Array.from(report.missingMixes),
  };
}