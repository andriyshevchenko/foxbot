import { Query } from "../core";

/**
 * A query that compares two numbers and returns true if the first is less than the second.
 *
 * @example
 * ```typescript
 * const five = new NumberLiteral(5);
 * const ten = new NumberLiteral(10);
 * const comparison = new LessThan(five, ten);
 * const result = await comparison.value(); // returns true
 * ```
 */
export class LessThan implements Query<boolean> {
  /**
   * Creates a new less-than comparison.
   *
   * @param a Query that returns the first number
   * @param b Query that returns the second number
   */
  constructor(
    private readonly a: Query<number>,
    private readonly b: Query<number>
  ) {}

  /**
   * Compares the two numbers.
   *
   * @returns Promise that resolves to true if a < b, false otherwise
   */
  async value(): Promise<boolean> {
    return (await this.a.value()) < (await this.b.value());
  }
}
