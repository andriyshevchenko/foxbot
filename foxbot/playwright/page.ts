import type { Page } from "playwright";
import { Query } from "../core";

/**
 * Represents a web page that can provide a Playwright Page.
 *
 * @example
 * ```typescript
 * const page = new PlaywrightPage(page);
 * const currentPage = await page.value();
 * ```
 */
export interface _Page extends Query<Page> {
  /**
   * Retrieves the web page.
   *
   * @returns Promise that resolves to the Playwright Page
   */
  value(): Promise<Page>;
}
