import type { Page } from "playwright";

import { Query } from "../core";

/**
 * A query that retrieves the current URL of a page.
 *
 * @example
 * ```typescript
 * const page = new PageOf(session);
 * const location = new LocationOf(page);
 * const url = await location.value();
 * ```
 */
export class LocationOf implements Query<string> {
  /**
   * Creates a new location query.
   *
   * @param page Query that returns the Playwright Page to inspect
   */
  constructor(private readonly page: Query<Page>) {}

  /**
   * Retrieves the current URL of the page.
   *
   * @returns Promise that resolves to the page URL
   */
  async value(): Promise<string> {
    return (await this.page.value()).url();
  }
}
