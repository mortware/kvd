import playwright from "playwright";
import useLoginPage from "../pages/loginPage.js";
import KvdConfiguration from '../config.js';
import { logDebug, logError } from "./logger.js";

export type Context = {
  page: playwright.Page;
  browser: playwright.Browser;
}

let context: Context | null = null;

async function createContext(username?: string, password?: string): Promise<Context> {

  const actionDelay = KvdConfiguration.processDelay || 0;
  logDebug(`Action delay: ${actionDelay}`);
  const headless = KvdConfiguration.headless;
  logDebug(`Headless: ${headless}`);

  const options = {
    headless,
    slowMo: actionDelay,
  };

  const browser = await playwright["chromium"].launch(options);
  const context = await browser.newContext();

  const page = await context.newPage();

  if (username && password) {
    const loginPage = useLoginPage(page)
    await loginPage.navigate();
    await loginPage.login(username, password);
  }

  return { page, browser };
}

async function getContext(username?: string, password?: string): Promise<Context> {
  if (context) {
    return context;
  }

  try {
    context = await createContext(username, password);
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
  }
}

const automation = {
  getContext,
  close: closeContext
};

export default automation;