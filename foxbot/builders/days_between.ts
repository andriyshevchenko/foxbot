import { Query } from "../core";

/**
 * A query that calculates the number of whole days between two dates.
 *
 * @example
 * ```typescript
 * const startDate = new FixedDate(new Date("2024-01-01"));
 * const endDate = new FixedDate(new Date("2024-01-11"));
 * const daysBetween = new DaysBetween(startDate, endDate);
 * const result = await daysBetween.value(); // returns 10
 * ```
 */
export class DaysBetween implements Query<number> {
  /**
   * Creates a new days-between calculation.
   *
   * @param start Query that returns the start date
   * @param end Query that returns the end date
   */
  constructor(
    private readonly start: Query<Date>,
    private readonly end: Query<Date>
  ) {}

  /**
   * Calculates the absolute number of whole days between the two dates.
   *
   * @returns Promise that resolves to the number of days between the dates
   */
  async value(): Promise<number> {
    const s = await this.start.value();
    const e = await this.end.value();
    const ms = Math.abs(e.getTime() - s.getTime());
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }
}
