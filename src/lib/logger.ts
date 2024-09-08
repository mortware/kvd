type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const colors = {
    gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
    blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
    green: (text: string) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
    red: (text: string) => `\x1b[31m${text}\x1b[0m`,
};

function formatMessage(level: LogLevel, ...args: any[]): string[] {
    const timestamp = new Date().toISOString().substring(11, 23);
    const coloredLevel = getColoredLevel(level);
    return [`${colors.gray(`[${timestamp}]`)} ${coloredLevel}`, ...args];
}

function getColoredLevel(level: LogLevel): string {
    switch (level) {
        case 'DEBUG': return colors.blue('DEBUG');
        case 'INFO': return colors.green('INFO');
        case 'WARN': return colors.yellow('WARN');
        case 'ERROR': return colors.red('ERROR');
    }
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