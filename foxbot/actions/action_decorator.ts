import { Action } from "../core";

/**
 * Base decorator class that wraps an action and forwards perform calls.
 * Follows the decorator pattern for composing complex actions.
 *
 * @example
 * ```typescript
 * class LoginWorkflow extends ActionDecorator {
 *   constructor(session: Session) {
 *     const workflow = new Sequence([...]);
 *     super(workflow);
 *   }
 * }
 * ```
 */
export abstract class ActionDecorator implements Action {
  /**
   * Creates a new action decorator.
   *
   * @param wrapped The action to wrap and delegate to
   */
  constructor(private readonly wrapped: Action) {}

  /**
   * Forwards the perform call to the wrapped action.
   *
   * @returns Promise that resolves when the wrapped action is complete
   */
  async perform(): Promise<void> {
    await this.wrapped.perform();
  }
}
