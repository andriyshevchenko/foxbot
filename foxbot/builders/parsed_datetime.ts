// foxbot/builders/parsed_datetime.ts
import { Query } from "../core";

export class ParsedDatetime implements Query<Date> {
  constructor(private readonly text: Query<string>) {}

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
      const msByUnit: Record<string, number> = {
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
        month: 30 * 86_400_000, // approximation for test stability
        months: 30 * 86_400_000,
        year: 365 * 86_400_000, // approximation
        years: 365 * 86_400_000,
      };
      const delta = msByUnit[unit];
      if (delta) return new Date(d.getTime() - n * delta);
    }

    const abs = new Date(raw);
    if (!isNaN(abs.getTime())) return abs;

    throw new Error(`ParsedDatetime: unsupported date/time: "${raw}"`);
  }
}
