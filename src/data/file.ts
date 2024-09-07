import fs from 'fs';
import { logDebug } from '../lib/logger';

async function saveStreamToDisk(stream: NodeJS.ReadableStream, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    logDebug(`Saving stream to disk: ${filePath}`);
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

async function prepareFolder(folder: string): Promise<void> {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

const localStorage = {
  saveStreamToDisk,
  prepareFolder
};

export default localStorage;