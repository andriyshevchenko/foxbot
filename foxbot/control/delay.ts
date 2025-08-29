import { Action, Query } from "#foxbot/core";

/**
 * An action that waits for a specified number of milliseconds.
 *
 * @example
 * ```typescript
 * const delay = new Delay(new NumberLiteral(1000));
 * await delay.perform(); // waits for 1 second
 * ```
 */
export class Delay implements Action {
  /**
   * Creates a new delay action.
   *
   * @param milliseconds Query that returns the number of milliseconds to wait
   */
  constructor(private readonly milliseconds: Query<number>) {}

  /**
   * Waits for the specified number of milliseconds.
   *
   * @returns Promise that resolves after the delay
   */
  async perform(): Promise<void> {
    const ms = await this.milliseconds.value();
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
