import queue from "../data/queue";
import { logError, logInfo } from "../lib/logger";


async function clearQueue(queueName: string) {
  try {
    await queue.clearQueue(queueName);
    logInfo('Import queue cleared successfully');
  } catch (error) {
    logError(`Failed to clear import queue: ${error}`);
  }
}

export { clearQueue };