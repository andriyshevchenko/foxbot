import type { Action } from "../core/action";
import type { Session } from "./session";

/**
 * Wraps an action and ensures the session is closed after the action runs.
 *
 * @example
 * ```typescript
 * const guard = new SessionGuard(action, session);
 * await guard.perform(); // session is closed afterward
 * ```
 */
export class SessionGuard implements Action {
  /**
   * Creates a new session guard.
   *
   * @param target Action to execute
   * @param session Session to close after execution
   */
  constructor(
    private readonly target: Action,
    private readonly session: Session
  ) {}

  /**
   * Executes the target action and closes the session afterward.
   *
   * @returns Promise that resolves when the action has run and the session is closed
   */
  async perform(): Promise<void> {
    // Acquire context first so we don't attempt to create it in an error state inside finally.
    const context = await this.session.profile();
    try {
      await this.target.perform();
    } finally {
      await context.close();
    }
  }
}
