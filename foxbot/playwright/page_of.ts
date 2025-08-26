import type { Page } from "playwright";

import { Query } from "../core";
import type { Session } from "./session";

/**
 * A query that retrieves an existing page from a browser session.
 *
 * @example
 * ```typescript
 * const page = new PageOf(session);
 * const current = await page.value();
 * ```
 */
export class PageOf implements Query<Page> {
  /**
   * Creates a new PageOf query.
   *
   * @param session The browser session to get a page from
   */
  constructor(private readonly session: Session) {}

  /**
   * Retrieves the first page from the session's host browser context.
   *
   * @returns Promise that resolves to an existing Playwright Page
   * @throws Error if the context has no pages
   */
  async value(): Promise<Page> {
    const context = await this.session.host();
    const page = context.pages()[0];
    if (!page) {
      throw new Error("No pages are available in the browser context");
    }
    return page;
  }
}
