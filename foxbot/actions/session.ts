import type { Action } from "../core/action";
import type { Session } from "../playwright/session";

/**
 * Action primitive that opens a browser session.
 * Calls the open() method on the provided session to initialize browser context.
 *
 * @example
 * ```typescript
 * const session = new DefaultSession();
 * const openAction = new OpenSession(session);
 * await openAction.perform(); // session is now open
 * ```
 */
export class OpenSession implements Action {
  /**
   * Creates a new open session action.
   *
   * @param session Session to open
   */
  constructor(private readonly session: Session) {}

  /**
   * Opens the browser session.
   *
   * @returns Promise that resolves when session is open
   */
  async perform(): Promise<void> {
    await this.session.open();
  }
}

/**
 * Action primitive that closes a browser session.
 * Calls the close() method on the provided session to clean up browser resources.
 *
 * @example
 * ```typescript
 * const closeAction = new CloseSession(session);
 * await closeAction.perform(); // session is now closed
 * ```
 */
export class CloseSession implements Action {
  /**
   * Creates a new close session action.
   *
   * @param session Session to close
   */
  constructor(private readonly session: Session) {}

  /**
   * Closes the browser session.
   *
   * @returns Promise that resolves when session is closed
   */
  async perform(): Promise<void> {
    await this.session.close();
  }
}
