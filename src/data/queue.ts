import { QueueServiceClient, QueueClient, DequeuedMessageItem } from '@azure/storage-queue';
import { logError, logInfo, logDebug, logWarning } from '../lib/logger';
import { DefaultAzureCredential } from '@azure/identity';
import { encodeBase64ToJson } from '../lib/utils';
import KvdConfiguration from '../config';
import { ImportRequest } from '../lib/models';

const queueStorageUrl = KvdConfiguration.azure.queue.url;
const defaultAzureCredential = new DefaultAzureCredential();

if (!queueStorageUrl) {
  throw new Error('Azure Queue Storage URL not found');
}

const queueServiceClient = new QueueServiceClient(queueStorageUrl, defaultAzureCredential);

// Fetch the next message from the queue
async function getImportRequest(): Promise<{ item: ImportRequest, messageId: string, popReceipt: string } | null> {
  const client = await getQueueClient('import');
  const response = await client.receiveMessages({ numberOfMessages: 1 });
  const message = response.receivedMessageItems[0];
  if (message) {
    const importRequest: ImportRequest = JSON.parse(Buffer.from(message.messageText, 'base64').toString('utf-8'));
    return { item: importRequest, messageId: message.messageId, popReceipt: message.popReceipt };
  }
  return null;
}

async function getQueueClient(queueName: string): Promise<QueueClient> {
  const client = queueServiceClient.getQueueClient(queueName);
  await client.createIfNotExists();
  logDebug(`Connected to Azure Queue Storage: ${queueName}`);
  return client;
}

async function deleteMessage(queueName: string, messageId: string, popReceipt: string): Promise<void> {
  const client = await getQueueClient(queueName);
  const response = await client.deleteMessage(messageId, popReceipt);
  if (response.errorCode) {
    logError('Failed to delete message from queue', queueName, response.errorCode);
  } else {
    logInfo(`Deleted message from queue: ${queueName}`);
  }
}

async function sendMessage(queueName: string, request: ImportRequest): Promise<void> {
  const message = JSON.stringify(request);

  try {
    const client = await getQueueClient(queueName);
    logDebug(`Sending message to queue: ${queueName}`);
    await client.sendMessage(Buffer.from(message).toString('base64'));
    logInfo(`Message sent successfully to queue: ${queueName}`);
  } catch (error) {
    logError(`Error sending message to queue ${queueName}: ${error}`);
    throw error;
  }
}

async function sendBatchMessages(queueName: string, requests: any[]): Promise<void> {
  const batchSize = 32; // Azure Queue Storage allows up to 32 messages per batch

  try {
    const client = await getQueueClient(queueName);
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      logDebug(`Sending batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(requests.length / batchSize)} to queue: ${queueName}`);

      await Promise.all(batch.map(request =>
        client.sendMessage(Buffer.from(JSON.stringify(request)).toString('base64'))
      ));
    }
    logInfo(`Successfully sent ${requests.length} messages to queue in batches: ${queueName}`);
  } catch (error) {
    logError(`Error sending batch messages to queue ${queueName}: ${error}`);
    throw error;
  }
}

async function clearQueue(queueName: string): Promise<void> {
  try {
    const client = await getQueueClient(queueName);
    await client.clearMessages();
    logInfo(`Cleared all messages from queue: ${queueName}`);
  } catch (error) {
    logError(`Error clearing queue ${queueName}: ${error}`);
    throw error;
  }
}

async function peekMessages(queueName: string): Promise<any[]> {
  const client = await getQueueClient(queueName);
  const response = await client.peekMessages({ numberOfMessages: 10 });

  return response.peekedMessageItems.map(msg => {
    if (!msg.messageText) {
      logWarning(`Received empty messageText for message ${msg.messageId}`);
      return null;
    }

    try {
      return {
        messageId: msg.messageId,
        messageText: encodeBase64ToJson(msg.messageText)
      };
    } catch (error) {
      logWarning(`Failed to decode message ${msg.messageId}: ${(error as Error).message}`);
      return {
        rawContent: msg.messageText,
        decodedContent: Buffer.from(msg.messageText, 'base64').toString('utf-8')
      };
    }
  }).filter(item => item !== null);
}

const queue = {
  sendMessage,
  sendBatchMessages,
  clearQueue,
  peekMessages,
  getImportRequest,
  deleteMessage
};

export default queue;
