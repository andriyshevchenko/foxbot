// foxbot/builders/days_between.ts
import { Query } from "../core";

export class DaysBetween implements Query<number> {
  constructor(
    private readonly start: Query<Date>,
    private readonly end: Query<Date>
  ) {}

  async value(): Promise<number> {
    const s = await this.start.value();
    const e = await this.end.value();
    const ms = Math.abs(e.getTime() - s.getTime());
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }
}
