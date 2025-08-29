import type { Action } from "#foxbot/core/action";
import type { Query } from "#foxbot/core/query";

/**
 * Fork action primitive that executes one of two actions based on a condition.
 * Provides if-else functionality for action composition with foxbot naming conventions.
 *
 * @example
 * ```typescript
 * const condition = new BooleanLiteral(true);
 * const fork = new Fork(condition, thenAction, elseAction);
 * await fork.perform(); // executes thenAction if condition is true
 * ```
 */
export class Fork implements Action {
  /**
   * Creates a new fork action.
   *
   * @param condition Query that returns boolean to determine which action to execute
   * @param thenAction Action to execute if condition is true
   * @param elseAction Action to execute if condition is false
   */
  constructor(
    private readonly condition: Query<boolean>,
    private readonly thenAction: Action,
    private readonly elseAction: Action
  ) {}

  /**
   * Executes either then or else action based on the condition.
   *
   * @returns Promise that resolves when the selected action completes
   */
  async perform(): Promise<void> {
    const shouldExecuteThen = await this.condition.value();
    if (shouldExecuteThen) {
      await this.thenAction.perform();
    } else {
      await this.elseAction.perform();
    }
  }
}
