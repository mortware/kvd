import playwright from "playwright";
import useLoginPage from "../pages/loginPage.js";
import KvdConfiguration from '../config';
import { logDebug } from "./logger.js";

export type Context = {
  page: playwright.Page;
  browser: playwright.Browser;
}



export default async function createContext(username: string, password: string): Promise<Context> {

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

  const loginPage = useLoginPage(page)
  await loginPage.navigate();
  await loginPage.login(username, password);

  return { page, browser };
}