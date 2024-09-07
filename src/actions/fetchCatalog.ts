import queue from "../data/queue";
import { logInfo } from "../lib/logger";
import createContext from "../lib/setup";
import myDownloadsPage from "../pages/myDownloadsPage";
import fs from "fs";

const importQueueName = process.env.AZURE_QUEUE_IMPORT_NAME as string;

type CatalogArgs = {
  username: string;
  password: string;
  output?: string;  // Make output optional
  queue: boolean;
};

async function fetchCatalog({ username, password, output: outputFile, queue: sendToQueue }: CatalogArgs) {

  console.log(`Hello, ${username}! Fetching catalog...`);

  const context = await createContext(username, password);

  const page = myDownloadsPage(context.page);
  await page.navigate();
  const tracks = await page.getTracks();

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2));
  }

  if (sendToQueue) {
    tracks.forEach(async track => {
      const request = {
        track,
        username,
        password
      }
      await queue.sendMessage(importQueueName, request);
    });
  }

  await context.browser.close();
  logInfo("All done!");
}

export { fetchCatalog, type CatalogArgs };