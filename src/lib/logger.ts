import config from '../consts';

export function logDebug(message: string) {
    console.debug(`[${new Date().toISOString().substring(11, 23)}] DEBUG`, message);
};

export function logInfo(message: string) {
    console.log(`[${new Date().toISOString().substring(11, 23)}] INFO`, message);
};

export function logWarning(message: string) {
    console.warn(`[${new Date().toISOString().substring(11, 23)}] WARN`, message);
};

export function logError(message: string) {
    console.error(`[${new Date().toISOString().substring(11, 23)}] ERROR`, message);
};