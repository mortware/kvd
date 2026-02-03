import playwright from "playwright";
import useLoginPage from "../browser/loginPage.js";
import KvdConfiguration from '../config.js';
import { logDebug, logError, logInfo } from "./logger.js";
import path from "path";
import fs from "fs";

export type Context = {
  page: playwright.Page;
  browser: playwright.Browser;
  currentUser?: string;
}

let context: Context | null = null;
let currentContextUser: string | null = null;

// Base user data directory for persistent sessions
const baseUserDataDir = path.join(process.cwd(), '.browser-data');

function getUserDataDir(username: string): string {
  // Sanitize username for directory name
  const sanitized = username.replace(/[^a-zA-Z0-9]/g, '_');
  return path.join(baseUserDataDir, sanitized);
}

async function createContext(username?: string, password?: string): Promise<Context> {

  const actionDelay = KvdConfiguration.processDelay || 0;
  logDebug(`Action delay: ${actionDelay}`);
  const headless = KvdConfiguration.headless;
  logDebug(`Headless: ${headless}`);

  // Determine user data directory - use per-user directory if username provided
  const userDataDir = username ? getUserDataDir(username) : path.join(baseUserDataDir, '_default');
  logDebug(`Using browser profile: ${userDataDir}`);
  
  // Ensure user data directory exists
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  // Use persistent context with stealth options
  const browserContext = await playwright.chromium.launchPersistentContext(userDataDir, {
    headless,
    slowMo: actionDelay,
    args: [
      '--disable-blink-features=AutomationControlled',
    ],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = browserContext.pages()[0] || await browserContext.newPage();

  // Hide webdriver flag
  await page.addInitScript(`
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  `);

  if (username && password) {
    const loginPage = useLoginPage(page);
    await loginPage.navigate();
    await loginPage.login(username, password);
  }

  // Return compatible Context object (browserContext has close method like browser)
  return { page, browser: browserContext as unknown as playwright.Browser, currentUser: username };
}

async function getContext(username?: string, password?: string): Promise<Context> {
  // If we need a different user, close and recreate
  if (context && username && currentContextUser !== username) {
    logDebug(`User mismatch: ${currentContextUser} -> ${username}, recreating context`);
    await closeContext();
  }
  
  if (context) {
    return context;
  }

  try {
    context = await createContext(username, password);
    currentContextUser = username || null;
    logDebug('Created browser context');
  } catch (err) {
    logError('Error creating browser context');
    throw err;
  }

  return context;
}

async function closeContext(): Promise<void> {
  if (context) {
    await context.browser.close();
    logDebug('Closed browser context');
    context = null;
    currentContextUser = null;
  }
}

const automation = {
  getContext,
  close: closeContext
};

export default automation;