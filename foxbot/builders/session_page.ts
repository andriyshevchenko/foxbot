import type { Page } from "playwright";

import { Query } from "../core";
import type { Session } from "../playwright/session";

/**
 * A query that creates a new page from a browser session.
 *
 * @example
 * ```typescript
 * const sessionPage = new SessionPage(session);
 * const page = await sessionPage.value();
 * ```
 */
export class SessionPage implements Query<Page> {
  /**
   * Creates a new session page query.
   *
   * @param session The browser session to create a page from
   */
  constructor(private readonly session: Session) {}

  /**
   * Creates a new page from the session's browser context.
   *
   * @returns Promise that resolves to a new Playwright Page
   */
  async value(): Promise<Page> {
    const context = await this.session.browser();
    return await context.newPage();
  }
}
