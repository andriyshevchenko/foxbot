import type { Browser } from "playwright";
import { chromium } from "playwright";
import type { Query } from "../../foxbot/core";

/**
 * Fake browser query implementation for session testing purposes.
 * Returns a real chromium browser instance for integration testing.
 *
 * @example
 * ```typescript
 * const browserQuery = new FakeBrowser();
 * const browser = await browserQuery.value(); // returns real chromium instance
 * ```
 */
export class FakeBrowser implements Query<Browser> {
  /**
   * Returns a real chromium browser instance.
   *
   * @returns Promise resolving to chromium Browser instance
   */
  async value(): Promise<Browser> {
    return await chromium.launch({ headless: true });
  }
}
