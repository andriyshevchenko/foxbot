import type { Locator as PwLocator } from "playwright";

import { Action, Query } from "#foxbot/core";

/**
 * An action that fills a form element with text.
 *
 * @example
 * ```typescript
 * const input = new Locator(page, "#username");
 * const text = new TextLiteral("john.doe");
 * const fill = new Fill(input, text);
 * await fill.perform();
 * ```
 */
export class Fill implements Action {
  /**
   * Creates a new fill action.
   *
   * @param element Query that returns the element to fill
   * @param text Query that returns the text to fill with
   */
  constructor(
    private readonly element: Query<PwLocator>,
    private readonly text: Query<string>
  ) {}

  /**
   * Fills the element with the specified text.
   *
   * @returns Promise that resolves when the fill action is complete
   */
  async perform(): Promise<void> {
    await (await this.element.value()).fill(await this.text.value());
  }
}
