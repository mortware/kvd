import KvdConfiguration from "./config";
import { logError } from "./lib/logger";

export * from "./actions";
export * from "./lib/utils.js";

let config: Readonly<typeof KvdConfiguration>;

try {
  config = Object.freeze({ ...KvdConfiguration });
} catch (error) {
  logError("Failed to initialize configuration:", (error as Error).message);
  throw error;
}

export { config };