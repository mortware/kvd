import db from "../data/db";
import { logInfo } from "../lib/logger";

type CheckArgs = {
  url: string;
}

async function check({ url }: CheckArgs) {
  logInfo(`Fetching track information...`);

  try {
    const result = await db.tracks.findByUrl(url);
    console.debug(result);
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
  logInfo("All done!");
}

export { check, type CheckArgs };