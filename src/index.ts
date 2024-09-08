import KvdConfiguration from "./config";

export * from "./actions";
export * from "./lib/models.js";
export * from "./lib/utils.js";

let config: typeof KvdConfiguration = KvdConfiguration;

export function initialize(newConfig: Partial<typeof KvdConfiguration>) {
  config = { ...KvdConfiguration, ...newConfig };
}

export function getConfig(key: keyof typeof KvdConfiguration) {
  const value = config[key] || process.env[key];
  if (value === undefined) {
    throw new Error(`Configuration value for '${key}' is missing. Please provide it via initialize() or set the corresponding environment variable.`);
  }
  return value;
}