import queue from "../data/queue";
import { logError, logInfo } from "../lib/logger";

async function listQueue(queueName: string) {
  try {
    const messages = await queue.peekMessages(queueName);
    logInfo('First 10 items in the import queue:');
    messages.forEach((msg, index) => {
      logInfo(`${index + 1}. ${JSON.stringify(msg)}`);
    });
  } catch (error) {
    logError(`Failed to list import queue: ${error}`);
  }
}

export { listQueue };