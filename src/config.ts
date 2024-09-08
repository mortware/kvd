import fs from "fs";
import path from "path";
import { ConfigDefaults } from "./consts";

const configPath = path.join(process.cwd(), ConfigDefaults.configFileName);
let fileConfig: Record<string, any> = {};

if (fs.existsSync(configPath)) {
    fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

const KvdConfiguration = {
    azure: {
        blob: {
            // Azure Blob Storage URL
            // Can be set in config file as azure.blob.storageUrl or as environment variable AZURE_BLOB_STORAGE_URL
            storageUrl: fileConfig.azure?.blob?.storageUrl || process.env.AZURE_BLOB_STORAGE_URL,

            // Azure Blob Storage Container name
            // Can be set in config file as azure.blob.containerName or as environment variable AZURE_BLOB_STORAGE_CONTAINER
            containerName: fileConfig.azure?.blob?.containerName || process.env.AZURE_BLOB_STORAGE_CONTAINER,
        },
        queue: {
            // Azure Queue Storage URL
            // Can be set in config file as azure.queue.storageUrl or as environment variable AZURE_QUEUE_STORAGE_URL
            storageUrl: fileConfig.azure?.queue?.storageUrl || process.env.AZURE_QUEUE_STORAGE_URL,

            // Azure Queue Import Name
            // Can be set in config file as azure.queue.importName or as environment variable AZURE_QUEUE_IMPORT_NAME
            importName: fileConfig.azure?.queue?.importName || process.env.AZURE_QUEUE_IMPORT_NAME,
        },
        sql: {
            // Azure SQL Database Server
            // Can be set in config file as azure.sql.server or as environment variable AZURE_SQL_SERVER
            server: fileConfig.azure?.sql?.server || process.env.AZURE_SQL_SERVER,

            // Azure SQL Database Name
            // Can be set in config file as azure.sql.database or as environment variable AZURE_SQL_DATABASE
            database: fileConfig.azure?.sql?.database || process.env.AZURE_SQL_DATABASE,
        },
    },
    // Process Delay (in milliseconds)
    // Can be set in config file as processDelay or as environment variable PROCESS_DELAY
    processDelay: fileConfig.processDelay || process.env.PROCESS_DELAY,
};

export default KvdConfiguration;