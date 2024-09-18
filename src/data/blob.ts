import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { logError, logInfo, logDebug, logWarning } from '../lib/logger';
import fs from 'fs/promises';
import path from 'path';
import { DefaultAzureCredential } from '@azure/identity';
import { Readable } from 'stream';
import KvdConfiguration from '../config';

let containerClient: ContainerClient | null = null;

const blobStorageUrl = KvdConfiguration.azure.blob.url;
const blobStorageContainerName = KvdConfiguration.azure.blob.container;
const defaultAzureCredential = new DefaultAzureCredential();

if (!blobStorageUrl) {
  throw new Error('Azure Blob Storage URL not found');
}

async function getContainerClient(): Promise<ContainerClient> {
  if (containerClient) {
    return containerClient;
  }

  try {
    const blobServiceClient = new BlobServiceClient(blobStorageUrl as string, defaultAzureCredential);
    containerClient = blobServiceClient.getContainerClient(blobStorageContainerName as string);
    await containerClient.createIfNotExists();
    logDebug('Connected to Azure Blob Storage');
  } catch (err) {
    logError('Error connecting to Azure Blob Storage');
    throw err;
  }

  return containerClient;
}

async function uploadFile(filePath: string, trackSlug: string, slug: string): Promise<string> {
  const client = await getContainerClient();
  try {
    const fileExtension = path.extname(filePath);
    const blobName = `${trackSlug}/${slug}${fileExtension}`;
    logDebug(`Checking if file "${blobName}" already exists in blob storage`);

    const blockBlobClient = client.getBlockBlobClient(blobName);

    const exists = await blockBlobClient.exists();

    if (exists) {
      logInfo(`File "${blobName}" already exists in blob storage. Skipping upload.`);
      return blobName;
    }

    logDebug(`Uploading file "${filePath}" to blob storage as "${blobName}"`);
    const fileContent = await fs.readFile(filePath);

    await blockBlobClient.upload(fileContent, fileContent.length);
    logInfo(`File "${blobName}" uploaded successfully to blob storage`);
    return blobName;
  } catch (error) {
    logError(`Error uploading file "${filePath}" to blob storage: ${error}`);
    throw error;
  }
}

async function deleteFolder(folderName: string): Promise<void> {
  const client = await getContainerClient();
  try {
    const normalizedFolderName = folderName.endsWith('/') ? folderName : `${folderName}/`;
    const blobs = client.listBlobsFlat({ prefix: normalizedFolderName });
    for await (const blob of blobs) {
      await client.getBlockBlobClient(blob.name).delete();
    }
  } catch (error) {
    logError(`Error deleting folder "${folderName}" from blob storage: ${error}`);
  }
}

async function deleteFile(fileName: string): Promise<void> {
  const client = await getContainerClient();
  try {
    const blockBlobClient = client.getBlockBlobClient(fileName);
    await blockBlobClient.delete();
    logWarning(`File "${fileName}" deleted successfully from blob storage`);
  } catch (error) {
    logError(`Error deleting file "${fileName}" from blob storage: ${error}`);
    throw error;
  }
}

async function checkExists(blobName: string): Promise<boolean> {
  const client = await getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(blobName);
  return await blockBlobClient.exists();
}

async function uploadStream(readableStream: Readable, blobName: string): Promise<string> {
  const client = await getContainerClient();
  try {
    const blockBlobClient = client.getBlockBlobClient(blobName);

    await blockBlobClient.uploadStream(readableStream);
    logDebug(`File "${blobName}" uploaded successfully to blob storage`);
    return blobName;
  } catch (error) {
    logError(`Error uploading stream to blob storage: ${error}`);
    throw error;
  }
}

async function checkFolderExists(folderName: string): Promise<boolean> {
  const client = await getContainerClient();
  try {
    const normalizedFolderName = folderName.endsWith('/') ? folderName : `${folderName}/`;
    const blobs = client.listBlobsFlat({ prefix: normalizedFolderName });

    for await (const blob of blobs) {
      return true;
    }
    return false;

  } catch (error) {
    logError(`Error checking folder "${folderName}" existence in blob storage: ${error}`);
    throw error;
  }
}

async function renameFile(oldName: string, newName: string) {
  const client = await getContainerClient();
  try {
    const source = client.getBlobClient(oldName);
    const target = client.getBlobClient(newName);

    const copyPoller = await target.beginCopyFromURL(source.url);
    await copyPoller.pollUntilDone();
    await source.delete();

    logInfo(`File "${oldName}" renamed to "${newName}" successfully in blob storage`);
  } catch (error) {
    logError(`Error renaming file "${oldName}" to "${newName}" in blob storage: ${error}`);
    throw error;
  }
}

async function listFiles(folderName: string): Promise<string[]> {
  const client = await getContainerClient();
  const blobs = client.listBlobsFlat({ prefix: folderName });
  const fileNames: string[] = [];
  for await (const blob of blobs) {
    fileNames.push(blob.name);
  }
  return fileNames;
}

async function hasFolder(folderName: string): Promise<boolean> {
  const client = await getContainerClient();
  try {
    const blobs = client.listBlobsFlat({ prefix: folderName });
    for await (const _ of blobs) {
      return true;
    }
    return false;
  } catch (error) {
    logError(`Error checking if folder "${folderName}" exists in blob storage: ${error}`);
    throw error;
  }
}

async function hasBlob(blobName: string): Promise<boolean> {
  const client = await getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(blobName);
  return await blockBlobClient.exists();
}

async function* listAllBlobs(): AsyncGenerator<string, void, unknown> {
  const client = await getContainerClient();
  const blobs = client.listBlobsFlat();
  for await (const blob of blobs) {
    yield blob.name;
  }
}

const blob = {
  checkExists,
  listFiles,
  uploadFile,
  deleteFile,
  uploadStream,
  deleteFolder,
  checkFolderExists,
  renameFile,
  hasFolder,
  hasBlob,
  listAllBlobs, // Add this new function to the exported object
};

export default blob;

