import fs from "fs";
import path from "path";
import { ConfigDefaults } from "./consts";
import { z } from "zod";
import { logError } from "./lib/logger";

interface KvdConfig {
    azure: {
        blob: {
            url: string;
            container: string;
        };
        cosmos: {
            url: string;
        };
    };
    processDelay?: number;
    headless?: boolean;
}

const configPath = path.join(process.cwd(), ConfigDefaults.configFileName);
let fileConfig: KvdConfig = {
    azure: {
        blob: { url: '', container: '' },
        cosmos: { url: '' }
    },
    headless: true,
};

if (fs.existsSync(configPath)) {
    fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

const KvdConfiguration: KvdConfig = {
    azure: {
        blob: {
            url: fileConfig.azure?.blob?.url || '',
            container: fileConfig.azure?.blob?.container || '',
        },
        cosmos: {
            url: fileConfig.azure?.cosmos?.url || ''
        },
    },
    processDelay: fileConfig.processDelay ?? 0,
    headless: fileConfig.headless ?? true,
};

const configSchema = z.object({
    azure: z.object({
        blob: z.object({
            url: z.string().min(1, "Azure Blob Storage URL is required"),
            container: z.string().min(1, "Azure Blob Storage container name is required"),
        }),
        cosmos: z.object({
            url: z.string().min(1, "Azure CosmosDB endpoint URL is required"),
        }),
    }),
    processDelay: z.number().nonnegative().optional(),
});

function validateConfig(config: KvdConfig): void {
    try {
        configSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues;
            issues.forEach((issue: z.ZodIssue) => {
                logError(issue.path.join('.'), `'${issue.message}'`);
            });
            throw new Error(`Invalid configuration: (${issues.length} errors)`);
        }
        throw error;
    }
}

validateConfig(KvdConfiguration);

export default KvdConfiguration;