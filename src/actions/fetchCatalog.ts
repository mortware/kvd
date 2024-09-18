import { logError, logInfo } from "../lib/logger";
import automation from "../lib/automation";
import myDownloadsPage, { SongItem } from "../pages/myDownloadsPage";
import db from "../data/db";
import { Track } from "../types";

type CatalogArgs = {
  username: string;
};

async function fetchCatalog({ username }: CatalogArgs): Promise<Partial<Track>[]> {
  try {
    const account = await db.accounts.find(username);
    if (!account) {
      throw new Error(`Account '${username}' not found.`);
    }
    const context = await automation.getContext(username, account.password);

    const page = myDownloadsPage(context.page);
    await page.navigate();
    const tracks = await page.getTracks();
    logInfo("All done!");
    return tracks;
  } catch (error) {
    logError(`Error fetching catalog: ${error}`);
    throw error;
  } finally {
    await automation.close();
  }
}

export { fetchCatalog, type CatalogArgs };