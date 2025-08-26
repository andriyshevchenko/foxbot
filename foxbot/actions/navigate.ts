import type { Page } from "playwright";

import { Action, Query } from "../core";

/**
 * An action that navigates a browser page to a specified URL.
 *
 * @example
 * ```typescript
 * const page = new PageOf(session);
 * const url = new TextLiteral("https://example.com");
 * const navigate = new Navigate(page, url);
 * await navigate.perform();
 * ```
 */
export class Navigate implements Action {
  /**
   * Creates a new navigation action.
   *
   * @param page Query that returns the Playwright page to navigate
   * @param url Query that returns the URL to navigate to
   */
  constructor(
    private readonly page: Query<Page>,
    private readonly url: Query<string>
  ) {}

  /**
   * Navigates the page to the specified URL.
   *
   * @returns Promise that resolves when navigation is complete
   */
  async perform(): Promise<void> {
    await (await this.page.value()).goto(await this.url.value());
  }
}
