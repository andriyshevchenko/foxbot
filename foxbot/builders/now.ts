import { Query } from "../core";

/**
 * A query that returns the current date and time.
 *
 * @example
 * ```typescript
 * const now = new Now();
 * const currentDate = await now.value();
 * console.log(currentDate); // current timestamp
 * ```
 */
export class Now implements Query<Date> {
  /**
   * Returns the current date and time.
   *
   * @returns Promise that resolves to the current Date
   */
  async value(): Promise<Date> {
    return new Date();
  }
}
