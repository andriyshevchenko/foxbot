import type { Page, Locator as PwLocator } from "playwright";

import { Query } from "../core";

/**
 * A query that locates elements on a page using a CSS selector.
 *
 * @example
 * ```typescript
 * const page = new PageOf(session);
 * const locator = new Locator(page, "#submit-button");
 * const element = await locator.value();
 * await element.click();
 * ```
 */
export class Locator implements Query<PwLocator> {
  /**
   * Creates a new Locator instance.
   *
   * @param page Query that returns the Playwright Page to search within
   * @param selector The CSS selector to locate elements
   */
  constructor(
    private readonly page: Query<Page>,
    private readonly selector: string
  ) {}

  /**
   * Locates the element using the provided selector.
   *
   * @returns Promise that resolves to the Playwright Locator
   */
  async value(): Promise<PwLocator> {
    return (await this.page.value()).locator(this.selector);
  }
}
