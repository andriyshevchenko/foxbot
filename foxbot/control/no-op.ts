import type { Action } from "../core/action";

/**
 * No-operation action primitive that does nothing when executed.
 * Useful for testing, placeholder actions, and default behaviors.
 *
 * @example
 * ```typescript
 * const noOp = new NoOp();
 * await noOp.perform(); // Does nothing, returns immediately
 * ```
 */
export class NoOp implements Action {
  /**
   * Executes the no-operation action.
   * This method intentionally does nothing and returns immediately.
   *
   * @returns Promise that resolves immediately
   */
  async perform(): Promise<void> {
    // Intentionally does nothing
  }
}
