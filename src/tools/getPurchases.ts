import automation from "../lib/automation";
import myDownloadsPage from "../browser/myDownloadsPage";
import db from "../data/db";
import { Track, CatalogCache } from "../types";

type GetPurchasesArgs = {
  username: string;
  skipCache?: boolean;
  maxCacheAge?: number; // in hours, default 24
};

type GetPurchasesResult = {
  tracks: Partial<Track>[];
  cached: boolean;
  cacheAgeHours?: number;
  fetchedAt: Date;
};

async function getPurchases({ username, skipCache = false, maxCacheAge = 24 }: GetPurchasesArgs): Promise<GetPurchasesResult> {
  try {
    const account = await db.accounts.find(username);
    if (!account) {
      throw new Error(`Account '${username}' not found.`);
    }

    // Check cache first
    if (!skipCache && account.catalog) {
      const cacheAge = (Date.now() - new Date(account.catalog.fetchedAt).getTime()) / (1000 * 60 * 60);
      if (cacheAge < maxCacheAge) {
        return {
          tracks: account.catalog.tracks.map(t => ({
            slug: t.slug,
            artist: t.artist,
            title: t.title,
            source: { url: t.sourceUrl, users: [], id: '' },
          })),
          cached: true,
          cacheAgeHours: Math.round(cacheAge * 10) / 10,
          fetchedAt: new Date(account.catalog.fetchedAt),
        };
      }
    }

    // Fetch fresh from website
    const context = await automation.getContext(username, account.password);
    const page = myDownloadsPage(context.page);
    await page.navigate();
    const tracks = await page.getTracks();

    // Cache the results
    const fetchedAt = new Date();
    const catalog: CatalogCache = {
      fetchedAt,
      tracks: tracks.map(t => ({
        sourceId: t.source?.id || '',
        slug: t.slug || '',
        artist: t.artist || '',
        title: t.title || '',
        sourceUrl: t.source?.url || '',
      })),
    };
    account.catalog = catalog;
    await db.accounts.update(account);

    return {
      tracks,
      cached: false,
      fetchedAt,
    };
  } finally {
    await automation.close();
  }
}

export { getPurchases, type GetPurchasesArgs, type GetPurchasesResult };