import type { Action } from "#foxbot/core";

/**
 * An action that executes a provided function when performed.
 *
 * @example
 * ```typescript
 * const lambda = new Lambda(async () => console.log("executed"));
 * await lambda.perform();
 * ```
 */
export class Lambda implements Action {
  /**
   * Creates a new lambda action.
   *
   * @param fn Function to execute when the action is performed
   */
  constructor(private readonly fn: () => void | Promise<void>) {}

  /**
   * Executes the wrapped function.
   *
   * @returns Promise that resolves when the function completes
   */
  async perform(): Promise<void> {
    await this.fn();
  }
}
