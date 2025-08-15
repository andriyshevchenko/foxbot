import { Query } from "../core";

/**
 * A query that parses various date/time formats into Date objects.
 * Supports relative dates like "today", "yesterday", "2 days ago", and absolute dates.
 *
 * @example
 * ```typescript
 * const text = new TextLiteral("2 days ago");
 * const parsed = new ParsedDatetime(text);
 * const date = await parsed.value(); // Date object 2 days in the past
 * ```
 */
export class ParsedDatetime implements Query<Date> {
  /**
   * Creates a new datetime parser.
   *
   * @param text Query that returns the date/time string to parse
   */
  constructor(private readonly text: Query<string>) {}

  /**
   * Parses the text into a Date object.
   *
   * @returns Promise that resolves to the parsed Date
   * @throws Error if the date format is not supported
   */
  async value(): Promise<Date> {
    const raw = (await this.text.value()).trim().toLowerCase();
    if (raw === "today") return new Date();
    if (raw === "yesterday") {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    }
    const rel = raw.match(/^(\d+)\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago$/);
    if (rel) {
      const n = Number(rel[1]);
      const unit = rel[2];
      const d = new Date();
      const units: Record<string, number> = {
        second: 1000,
        seconds: 1000,
        minute: 60_000,
        minutes: 60_000,
        hour: 3_600_000,
        hours: 3_600_000,
        day: 86_400_000,
        days: 86_400_000,
        week: 7 * 86_400_000,
        weeks: 7 * 86_400_000,
        month: 30 * 86_400_000,
        months: 30 * 86_400_000,
        year: 365 * 86_400_000,
        years: 365 * 86_400_000,
      };
      const delta = units[unit];
      if (delta) return new Date(d.getTime() - n * delta);
    }
    const abs = new Date(raw);
    if (!isNaN(abs.getTime())) return abs;
    throw new Error(`ParsedDatetime: unsupported date/time: "${raw}"`);
  }
}
