import path from "path";
import db from "../data/db";
import { logError, logInfo } from "../lib/logger";
import { getSongInfoFromFile } from "../lib/utils";
import fs from "fs";
import blob from "../data/blob";

type UploadArgs = {
  input: string;
}

type UploadItem = {
  name: string;
  slug: string;
  color?: string;
  index?: number;
};

type UploadItemType = 'stem' | 'mix';

async function uploadSong({ input: folder }: UploadArgs) {
  const songInfo = await getSongInfoFromFile(folder);

  try {
    const track = await db.tracks.create(songInfo.artist, songInfo.title, songInfo.url, songInfo.source, songInfo.tempo, songInfo.tempoVariable, songInfo.duration, songInfo.key);
    if (!track || !track.Id) {
      logError(`Failed to create or find track '${songInfo.title} by ${songInfo.artist}'`);
      return;
    }

    await uploadItems(track.Id, track.Slug, songInfo.stems, folder, 'stem');
    await uploadItems(track.Id, track.Slug, songInfo.mixes, folder, 'mix');

    logInfo(`Song '${songInfo.title}' by '${songInfo.artist}' with its stems and mixes uploaded successfully.`);
  } catch (err) {
    logError("Error during upload: " + err);
  } finally {
    await db.close();
  }
}

async function uploadItems(trackId: string, trackSlug: string, items: UploadItem[] | undefined, folder: string, itemType: UploadItemType): Promise<void> {
  if (!items) return;

  for (const item of items) {
    const filePath = path.join(folder, `${item.slug}.mp3`);

    if (!fs.existsSync(filePath)) {
      logError(`${itemType} file not found: ${filePath}`);
      continue;
    }

    try {
      const blobName = await blob.uploadFile(filePath, trackSlug, item.slug);
      logInfo(`Uploaded ${itemType} file: ${item.name}`);

      const existingItem = itemType === 'stem'
        ? await db.stems.find(item.slug, trackId)
        : await db.mixes.find(item.slug, trackId);

      if (existingItem) {
        logInfo(`${itemType} already exists in database: ${item.name}`);
      } else {
        if (itemType === 'stem') {
          await db.stems.create(trackId, item.name, item.slug, item.color!, blobName, item.index!);
        } else {
          await db.mixes.create(trackId, item.name, item.slug, blobName);
        }
        logInfo(`Inserted ${itemType} into database: ${item.name}`);
      }
    } catch (err) {
      logError(`Failed to process ${itemType} '${item.name}': ${(err as Error).message}`);
    }
  }
}

export { uploadSong, type UploadArgs };