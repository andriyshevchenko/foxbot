import type { BrowserContext } from "playwright";

/**
 * Interface for managing a Playwright browser session lifecycle.
 * Implements AsyncDisposable for automatic cleanup.
 */
export interface Session extends AsyncDisposable {
  /**
   * Opens a new browser session with a context and page.
   * Must be called before using page().
   */
  open(): Promise<void>;

  /**
   * Returns the Playwright browser context instance.
   * @throws Error if session is not open
   */
  browser(): Promise<BrowserContext>;
}
