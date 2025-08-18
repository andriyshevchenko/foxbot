import type { Locator as PwLocator, Page } from "playwright";

import { Query } from "../core";

/**
 * A query that locates elements on a page using a CSS selector.
 *
 * @example
 * ```typescript
 * const locator = new Locator(page, "#submit-button");
 * const element = await locator.value();
 * await element.click();
 * ```
 */
export class Locator implements Query<PwLocator> {
  /**
   * Creates a new Locator instance.
   *
   * @param page The Playwright Page to search within
   * @param selector The CSS selector to locate elements
   */
  constructor(
    private readonly page: Page,
    private readonly selector: string
  ) {}

  /**
   * Locates the element using the provided selector.
   *
   * @returns Promise that resolves to the Playwright Locator
   */
  async value(): Promise<PwLocator> {
    return this.page.locator(this.selector);
  }
}
