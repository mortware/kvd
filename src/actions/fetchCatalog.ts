import { logError, logInfo } from "../lib/logger";
import automation from "../lib/automation";
import myDownloadsPage, { SongItem } from "../pages/myDownloadsPage";
import cosmos from "../data/cosmos";

type CatalogArgs = {
  username: string;
};

async function fetchCatalog({ username }: CatalogArgs): Promise<SongItem[]> {
  try {
    const account = await cosmos.getAccount(username);
    const context = await automation.getContext(username, account.password);

    const page = myDownloadsPage(context.page);
    await page.navigate();
    const songInfos = await page.getTracks();
    logInfo("All done!");
    return songInfos;
  } catch (error) {
    logError(`Error fetching catalog: ${error}`);
    throw error;
  } finally {
    await automation.close();
  }
}

export { fetchCatalog, type CatalogArgs };