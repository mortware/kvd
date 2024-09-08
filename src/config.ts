import fs from "fs";
import path from "path";
import { ConfigDefaults } from "./consts";

// Define the structure of the configuration
interface KvdConfig {
    azure?: {
        blob?: {
            /** URL for Azure Blob Storage */
            storageUrl?: string;
            /** Name of the container in Azure Blob Storage */
            containerName?: string;
        };
        queue?: {
            /** URL for Azure Queue Storage */
            storageUrl?: string;
            /** Name of the import queue in Azure Queue Storage */
            importName?: string;
        };
        sql?: {
            /** Azure SQL Server address */
            server?: string;
            /** Name of the database in Azure SQL */
            database?: string;
        };
    };
    /** Delay in milliseconds. Helps to slow down the automation process. */
    processDelay?: number;
}

const configPath = path.join(process.cwd(), ConfigDefaults.configFileName);
let fileConfig: KvdConfig = {};

if (fs.existsSync(configPath)) {
    fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

/**
 * KvdConfiguration
 * 
 * This configuration can be set through:
 * 1. A JSON config file (default: kvd-config.json in the current working directory)
 * 2. Environment variables
 * 3. Direct assignment when importing this module
 * 
 * Priority: Direct assignment > Environment variables > Config file
 */
const KvdConfiguration: KvdConfig = {
    azure: {
        blob: {
            /** Azure Blob Storage URL (env: AZURE_BLOB_STORAGE_URL) */
            storageUrl: process.env.AZURE_BLOB_STORAGE_URL || fileConfig.azure?.blob?.storageUrl,
            /** Azure Blob Storage container name (env: AZURE_BLOB_STORAGE_CONTAINER) */
            containerName: process.env.AZURE_BLOB_STORAGE_CONTAINER || fileConfig.azure?.blob?.containerName,
        },
        queue: {
            /** Azure Queue Storage URL (env: AZURE_QUEUE_STORAGE_URL) */
            storageUrl: process.env.AZURE_QUEUE_STORAGE_URL || fileConfig.azure?.queue?.storageUrl,
            /** Azure Queue import name (env: AZURE_QUEUE_IMPORT_NAME) */
            importName: process.env.AZURE_QUEUE_IMPORT_NAME || fileConfig.azure?.queue?.importName,
        },
        sql: {
            /** Azure SQL Server address (env: AZURE_SQL_SERVER) */
            server: process.env.AZURE_SQL_SERVER || fileConfig.azure?.sql?.server,
            /** Azure SQL Database name (env: AZURE_SQL_DATABASE) */
            database: process.env.AZURE_SQL_DATABASE || fileConfig.azure?.sql?.database,
        },
    },
    /** Process delay in milliseconds (env: PROCESS_DELAY) */
    processDelay: process.env.PROCESS_DELAY ? parseInt(process.env.PROCESS_DELAY, 10) : fileConfig.processDelay,
};

export default KvdConfiguration;

// Helper function to update configuration at runtime
export function updateConfig(newConfig: Partial<KvdConfig>): void {
    Object.assign(KvdConfiguration, newConfig);
}