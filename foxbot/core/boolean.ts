import { Query } from "./query";

/**
 * A query that returns a boolean literal value.
 *
 * @example
 * ```typescript
 * const query = new BooleanLiteral(true);
 * const result = await query.value(); // returns true
 * ```
 */
export class BooleanLiteral implements Query<boolean> {
  /**
   * Creates a new boolean literal query.
   *
   * @param b The boolean value to return
   */
  constructor(private readonly b: boolean) {}

  /**
   * Returns the boolean value.
   *
   * @returns Promise that resolves to the boolean value
   */
  async value(): Promise<boolean> {
    return this.b;
  }
}
