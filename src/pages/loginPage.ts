import { Page } from "playwright";
import config from "../config";
import { logDebug, logInfo } from "../lib/logger";

export default function useLoginPage(page: Page) {
  const usernameInput = page.locator("#frm_login");
  const passwordInput = page.locator("#frm_password");
  const submitButton = page.locator("#sbm");

  async function navigate() {
    const url = `${config.baseUrl}/${config.loginUrl}`
    logDebug(`Navigating to ${url}`);
    await page.goto(`${url}`);
  };

  async function login(username: string, password: string) {
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
    logInfo(`Logged in as '${username}'`);
  }

  return { navigate, login };
}

