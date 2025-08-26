import { Query } from "../core";

/**
 * A query that generates a random delay between specified minimum and maximum bounds.
 *
 * @example
 * ```typescript
 * const delay = new RandomDelay(new NumberLiteral(800), new NumberLiteral(1500));
 * const milliseconds = await delay.value(); // returns random number between 800-1500
 * ```
 */
export class RandomDelay implements Query<number> {
  /**
   * Creates a new random delay query.
   *
   * @param min Query that returns the minimum delay in milliseconds
   * @param max Query that returns the maximum delay in milliseconds
   */
  constructor(
    private readonly min: Query<number>,
    private readonly max: Query<number>
  ) {}

  /**
   * Generates a random delay between the minimum and maximum bounds.
   *
   * @returns Promise that resolves to a random delay in milliseconds
   */
  async value(): Promise<number> {
    const minValue = await this.min.value();
    const maxValue = await this.max.value();
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  }
}
