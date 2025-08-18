import type { Page } from "playwright";

import { Action, Query } from "../core";

/**
 * An action that navigates a browser page to a specified URL.
 *
 * @example
 * ```typescript
 * const url = new TextLiteral("https://example.com");
 * const navigate = new Navigate(page, url);
 * await navigate.perform();
 * ```
 */
export class Navigate implements Action {
  /**
   * Creates a new navigation action.
   *
   * @param page The Playwright page to navigate
   * @param url Query that returns the URL to navigate to
   */
  constructor(
    private readonly page: Page,
    private readonly url: Query<string>
  ) {}

  /**
   * Navigates the page to the specified URL.
   *
   * @returns Promise that resolves when navigation is complete
   */
  async perform(): Promise<void> {
    await this.page.goto(await this.url.value());
  }
}
