import playwright from "playwright";
import useLoginPage from "../pages/loginPage.js";
import KvdConfiguration from '../config';

export type Context = {
  page: playwright.Page;
  browser: playwright.Browser;
}

const actionDelay = KvdConfiguration.processDelay || 0;

export default async function createContext(username: string, password: string): Promise<Context> {
  const browser = await playwright["chromium"].launch({ headless: true, slowMo: actionDelay });
  const context = await browser.newContext();

  const page = await context.newPage();

  const loginPage = useLoginPage(page)
  await loginPage.navigate();
  await loginPage.login(username, password);

  return { page, browser };
}