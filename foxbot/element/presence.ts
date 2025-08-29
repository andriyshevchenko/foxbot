import type { Locator as PwLocator } from "playwright";

import { Query } from "#foxbot/core";

/**
 * A query that checks whether an element is present on the page.
 *
 * @example
 * ```typescript
 * const button = new Locator(page, "#submit-button");
 * const presence = new Presence(button);
 * const isPresent = await presence.value(); // true if element exists
 * ```
 */
export class Presence implements Query<boolean> {
  /**
   * Creates a new presence check.
   *
   * @param locator Query that returns the element to check for presence
   */
  constructor(private readonly locator: Query<PwLocator>) {}

  /**
   * Checks if the element is present on the page.
   *
   * @returns Promise that resolves to true if element exists, false otherwise
   */
  async value(): Promise<boolean> {
    const loc = await this.locator.value();
    return (await loc.count()) > 0;
  }
}
