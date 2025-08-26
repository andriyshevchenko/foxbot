import type { BrowserContext } from "playwright";

/**
 * Interface for managing a Playwright browser session lifecycle.
 * Provides explicit lifecycle management with open and close methods.
 */
export interface Session {
  /**
   * Opens a new browser session with a context and page.
   * Must be called before using page().
   */
  open(): Promise<void>;

  /**
   * Returns the Playwright browser context instance.
   * @throws Error if session is not open
   */
  host(): Promise<BrowserContext>;

  /**
   * Closes the browser session and cleans up resources.
   */
  close(): Promise<void>;
}
