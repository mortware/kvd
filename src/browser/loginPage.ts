import { Page } from "playwright";
import { logDebug, logInfo, logWarning } from "../lib/logger";
import { KaraokeVersionConfig } from "../consts";

export default function useLoginPage(page: Page) {
  const usernameInput = page.locator("#frm_login");
  const passwordInput = page.locator("#frm_password");
  const submitButton = page.locator("#sbm");

  async function navigate() {
    const url = `${KaraokeVersionConfig.baseUrl}/${KaraokeVersionConfig.loginUrl}`;
    logDebug(`Navigating to ${url}`);
    await page.goto(url);
    await page.waitForLoadState('networkidle');
  };

  async function getCurrentUser(): Promise<string | null> {
    // Navigate to account page to check logged in user
    logDebug('Checking current logged in user');
    await page.goto(`${KaraokeVersionConfig.baseUrl}/my/account.html`);
    await page.waitForLoadState('networkidle');
    
    // If redirected to login, not logged in
    if (page.url().includes('login')) {
      logDebug('Not logged in (redirected to login)');
      return null;
    }
    
    // Try to get email from account page
    const emailField = page.locator('input[name="email"]');
    const email = await emailField.inputValue().catch(() => null);
    if (email) {
      logDebug(`Currently logged in as: ${email}`);
      return email;
    }
    
    logDebug('Could not determine current user');
    return null;
  }

  async function login(username: string, password: string) {
    // Check if already logged in (redirected away from login page)
    const currentUrl = page.url();
    if (!currentUrl.includes('login')) {
      logInfo(`Already logged in, skipping login`);
      return;
    }

    // Check if login form exists
    const hasLoginForm = await usernameInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasLoginForm) {
      const title = await page.title();
      logWarning(`Login form not found. Page title: ${title}`);
      throw new Error(`Login page not available. Page title: ${title}`);
    }

    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    logInfo(`Logged in as '${username}'`);
  }

  async function logout() {
    logDebug('Logging out');
    await page.goto(`${KaraokeVersionConfig.baseUrl}/my/logout.html`);
    await page.waitForLoadState('networkidle');
  }

  return { navigate, login, getCurrentUser, logout };
}

