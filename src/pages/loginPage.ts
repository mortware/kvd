import { Page } from "playwright";
import { logDebug, logInfo } from "../lib/logger";
import { KaraokeVersionConfig } from "../consts";
import path from "path";

export default function useLoginPage(page: Page) {
  const usernameInput = page.locator("#frm_login");
  const passwordInput = page.locator("#frm_password");
  const submitButton = page.locator("#sbm");

  async function navigate() {
    const url = path.join(KaraokeVersionConfig.baseUrl, KaraokeVersionConfig.loginUrl);
    logDebug(`Navigating to ${url}`);
    await page.goto(url);
  };

  async function login(username: string, password: string) {
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
    logInfo(`Logged in as '${username}'`);
  }

  return { navigate, login };
}

