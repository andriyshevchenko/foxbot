import { Query } from "../core";

/**
 * A query that returns a number literal value.
 *
 * @example
 * ```typescript
 * const num = new NumberLiteral(42);
 * const result = await num.value(); // returns 42
 * ```
 */
export class NumberLiteral implements Query<number> {
  /**
   * Creates a new number literal query.
   *
   * @param n The number value to return
   */
  constructor(private readonly n: number) {}

  /**
   * Returns the number value.
   *
   * @returns Promise that resolves to the number value
   */
  async value(): Promise<number> {
    return this.n;
  }
}
