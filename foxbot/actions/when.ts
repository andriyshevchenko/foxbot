import { Action, Query } from "../core";

/**
 * A conditional action that executes another action only if a predicate is true.
 *
 * @example
 * ```typescript
 * const condition = new BooleanLiteral(true);
 * const action = new ClickAction();
 * const when = new When(condition, action);
 * await when.perform(); // executes action only if condition is true
 * ```
 */
export class When implements Action {
  /**
   * Creates a new conditional action.
   *
   * @param p Query that returns a boolean predicate
   * @param t Action to execute if predicate is true
   */
  constructor(
    private readonly p: Query<boolean>,
    private readonly t: Action
  ) {}

  /**
   * Executes the action if the predicate evaluates to true.
   *
   * @returns Promise that resolves when the conditional execution is complete
   */
  async perform(): Promise<void> {
    if (await this.p.value()) {
      await this.t.perform();
    }
  }
}
