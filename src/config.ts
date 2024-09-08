import fs from "fs";
import path from "path";
import { ConfigDefaults } from "./consts";

// Updated interface with required properties
interface KvdConfig {
    azure: {
        blob: {
            /** URL for Azure Blob Storage */
            url: string;
            /** Name of the container in Azure Blob Storage */
            container: string;
        };
        queue: {
            /** URL for Azure Queue Storage */
            url: string;
            /** Name of the import queue in Azure Queue Storage */
            import?: string;
            /** Name of the catalog queue in Azure Queue Storage */
            catalog?: string;
        };
        sql: {
            /** Azure SQL Server address */
            server: string;
            /** Name of the database in Azure SQL */
            database: string;
        };
    };
    /** Delay in milliseconds. Helps to slow down the automation process. */
    processDelay?: number;
}

const configPath = path.join(process.cwd(), ConfigDefaults.configFileName);
let fileConfig: KvdConfig = {
    azure: {
        blob: { url: '', container: '' },
        queue: { url: '' },
        sql: { server: '', database: '' }
    }
};

if (fs.existsSync(configPath)) {
    fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

/**
 * KvdConfiguration
 * 
 * This configuration is set through a JSON config file
 * (default: kvd-config.json in the current working directory)
 */
const KvdConfiguration: KvdConfig = {
    azure: {
        blob: {
            /** Azure Blob Storage URL */
            url: fileConfig.azure?.blob?.url || '',
            /** Azure Blob Storage container name */
            container: fileConfig.azure?.blob?.container || '',
        },
        queue: {
            /** Azure Queue Storage URL */
            url: fileConfig.azure?.queue?.url || '',
            /** Azure Queue import name */
            import: fileConfig.azure?.queue?.import,
            /** Azure Queue catalog name */
            catalog: fileConfig.azure?.queue?.catalog,
        },
        sql: {
            /** Azure SQL Server address */
            server: fileConfig.azure?.sql?.server || '',
            /** Azure SQL Database name */
            database: fileConfig.azure?.sql?.database || '',
        },
    },
    /** Process delay in milliseconds */
    processDelay: fileConfig.processDelay ?? 0,
};

export default KvdConfiguration;