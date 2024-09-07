import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { logError, logInfo, logDebug } from '../lib/logger';
import fs from 'fs/promises';
import path from 'path';
import { DefaultAzureCredential } from '@azure/identity';
import { Readable } from 'stream';

let containerClient: ContainerClient | null = null;

const blobStorageUrl = process.env.AZURE_BLOB_STORAGE_URL;
const blobStorageContainerName = process.env.AZURE_BLOB_STORAGE_CONTAINER;
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

async function deleteFile(fileName: string): Promise<void> {
  const client = await getContainerClient();
  try {
    const blockBlobClient = client.getBlockBlobClient(fileName);
    await blockBlobClient.delete();
    logInfo(`File "${fileName}" deleted successfully from blob storage`);
  } catch (error) {
    logError(`Error deleting file "${fileName}" from blob storage: ${error}`);
    throw error;
  }
}

async function uploadStream(readableStream: Readable, trackSlug: string, slug: string, fileExtension: string): Promise<string> {
  const client = await getContainerClient();
  try {
    const blobName = `${trackSlug}/${slug}${fileExtension}`;
    logDebug(`Checking if file "${blobName}" already exists in blob storage`);

    const blockBlobClient = client.getBlockBlobClient(blobName);

    const exists = await blockBlobClient.exists();

    if (exists) {
      logInfo(`File "${blobName}" already exists in blob storage. Skipping upload.`);
      return blobName;
    }

    logDebug(`Uploading stream to blob storage as "${blobName}"`);

    await blockBlobClient.uploadStream(readableStream);
    logInfo(`File "${blobName}" uploaded successfully to blob storage`);
    return blobName;
  } catch (error) {
    logError(`Error uploading stream to blob storage: ${error}`);
    throw error;
  }
}

const blob = {
  uploadFile,
  deleteFile,
  uploadStream, // Add this new function to the exported object
};

export default blob;

