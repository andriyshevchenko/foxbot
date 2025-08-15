import { Action } from "../core";

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 *
 * @param ms Number of milliseconds to wait
 * @returns Promise that resolves after the delay
 */
const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * An action that waits for a specified number of seconds before executing another action.
 *
 * @example
 * ```typescript
 * const click = new Click(button);
 * const delayedClick = new Delay(2, click);
 * await delayedClick.perform(); // waits 2 seconds then clicks
 * ```
 */
export class Delay implements Action {
  /**
   * Creates a new delayed action.
   *
   * @param s Number of seconds to wait before executing the action
   * @param a Action to execute after the delay
   */
  constructor(
    private readonly s: number,
    private readonly a: Action
  ) {}

  /**
   * Waits for the specified duration then executes the action.
   *
   * @returns Promise that resolves when the delayed action is complete
   */
  async perform(): Promise<void> {
    await sleep(this.s * 1000);
    await this.a.perform();
  }
}
