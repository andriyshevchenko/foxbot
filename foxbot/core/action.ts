/* c8 ignore file */
/**
 * Represents an action that can be performed asynchronously.
 *
 * @example
 * ```typescript
 * class ClickAction implements Action {
 *   async perform(): Promise<void> {
 *     // Click implementation
 *   }
 * }
 * ```
 */
export interface Action {
  /**
   * Executes the action asynchronously.
   *
   * @returns Promise that resolves when the action is complete
   */
  perform(): Promise<void>;
}
