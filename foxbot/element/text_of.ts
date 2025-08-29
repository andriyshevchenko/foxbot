import type { Locator as PwLocator } from "playwright";

import { Query } from "#foxbot/core";

/**
 * A query that extracts the text content from a web element.
 *
 * @example
 * ```typescript
 * const element = new Locator(page, "#message");
 * const textOf = new TextOf(element);
 * const content = await textOf.value(); // returns trimmed text content
 * ```
 */
export class TextOf implements Query<string> {
  /**
   * Creates a new text extraction query.
   *
   * @param locator Query that returns the element to extract text from
   */
  constructor(private readonly locator: Query<PwLocator>) {}

  /**
   * Extracts and returns the trimmed text content of the element.
   *
   * @returns Promise that resolves to the trimmed text content, or empty string if no text
   */
  async value(): Promise<string> {
    const loc = await this.locator.value();
    const txt = await loc.textContent();
    return (txt ?? "").trim();
  }
}
