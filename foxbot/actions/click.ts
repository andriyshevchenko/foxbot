import type { Locator as PwLocator } from "playwright";
import { Action } from "../core";
import { Query } from "../core";

/**
 * An action that clicks on a web element.
 *
 * @example
 * ```typescript
 * const button = new Locator(page, "#submit-button");
 * const click = new Click(button);
 * await click.perform();
 * ```
 */
export class Click implements Action {
  /**
   * Creates a new click action.
   *
   * @param element Query that returns the element to click
   */
  constructor(private readonly element: Query<PwLocator>) {}

  /**
   * Performs the click action on the element.
   *
   * @returns Promise that resolves when the click is complete
   */
  async perform(): Promise<void> {
    await (await this.element.value()).click();
  }
}
