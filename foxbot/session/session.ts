import type { BrowserContext } from "playwright";

/**
 * Interface for managing a Playwright browser session lifecycle.
 * Provides explicit lifecycle management with open and close methods.
 */
export interface Session {
  /**
   * Returns the Playwright browser context instance.
   * @throws Error if session is not open
   */
  profile(): Promise<BrowserContext>;
}
