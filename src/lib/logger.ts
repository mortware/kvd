type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

function formatMessage(level: LogLevel, ...args: any[]): string[] {
    const timestamp = new Date().toISOString().substring(11, 23);
    return [`[${timestamp}] ${level}`, ...args];
}

export function logDebug(...args: any[]) {
    console.debug(...formatMessage('DEBUG', ...args));
}

export function logInfo(...args: any[]) {
    console.log(...formatMessage('INFO', ...args));
}

export function logWarning(...args: any[]) {
    console.warn(...formatMessage('WARN', ...args));
}

export function logError(...args: any[]) {
    console.error(...formatMessage('ERROR', ...args));
}