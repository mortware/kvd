import fs from "fs";
import path from "path";
import { ConfigDefaults } from "./consts";
import { z } from "zod";
import { logError } from "./lib/logger";

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
        cosmos: {
            /** Azure CosmosDB endpoint URL */
            url: string;
        };
    };
    /** Delay in milliseconds. Helps to slow down the automation process. */
    processDelay?: number;
    /** Headless mode for Playwright */
    headless?: boolean;
}

const configPath = path.join(process.cwd(), ConfigDefaults.configFileName);
let fileConfig: KvdConfig = {
    azure: {
        blob: { url: '', container: '' },
        queue: { url: '' },
        cosmos: { url: '' }
    },
    headless: true,
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
        cosmos: {
            /** Cosmos endpoint URL */
            url: fileConfig.azure?.cosmos?.url || ''
        },
    },
    /** Process delay in milliseconds */
    processDelay: fileConfig.processDelay ?? 0,
    /** Headless mode for Playwright */
    headless: fileConfig.headless ?? true,
};

// Add this validation schema
const configSchema = z.object({
    azure: z.object({
        blob: z.object({
            url: z.string().min(1, "Azure Blob Storage URL is required"),
            container: z.string().min(1, "Azure Blob Storage container name is required"),
        }),
        queue: z.object({
            url: z.string().min(1, "Azure Queue Storage URL is required"),
            import: z.string().optional(),
            catalog: z.string().optional(),
        }),
        cosmos: z.object({
            url: z.string().min(1, "Azure CosmosDB endpoint URL is required"),
        }),
    }),
    processDelay: z.number().nonnegative().optional(),
});

/**
 * Validates the configuration and throws an error if it's invalid
 * @param config The configuration object to validate
 * @throws {Error} If the configuration is invalid
 */
function validateConfig(config: KvdConfig): void {
    try {
        configSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => {
                logError(err.path.join('.'), `'${err.message}'`);
                return err.message
            });
            throw new Error(`Invalid configuration: (${errorMessages.length} errors)`);
        }
        throw error;
    }
}

// Add this validation call after the KvdConfiguration object is created
validateConfig(KvdConfiguration);

export default KvdConfiguration;