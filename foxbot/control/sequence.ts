import { Action } from "#foxbot/core";

/**
 * An action that executes multiple actions in sequence.
 *
 * @example
 * ```typescript
 * const sequence = new Sequence([
 *   new ClickAction(),
 *   new FillAction("text"),
 *   new SubmitAction()
 * ]);
 * await sequence.perform();
 * ```
 */
export class Sequence implements Action {
  /**
   * Creates a new sequence of actions.
   *
   * @param steps Array of actions to execute in order
   */
  constructor(private readonly steps: Action[]) {}

  /**
   * Executes all actions in sequence.
   *
   * @returns Promise that resolves when all actions are complete
   */
  async perform(): Promise<void> {
    for (const s of this.steps) {
      await s.perform();
    }
  }
}
