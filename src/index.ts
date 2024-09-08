export * from "./actions";
export * from "./lib/models.js";
export * from "./lib/utils.js";

let config: Record<string, string> = {};

export function initialize(newConfig: Record<string, string>) {
  config = { ...config, ...newConfig };
}

export function getConfig(key: string) {
  return config[key] || process.env[key];
}