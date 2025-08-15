import { describe, it, expect } from "vitest";
import { LessThan } from "../foxbot/builders/less_than";
import { DaysBetween } from "../foxbot/builders/days_between";
import type { Query } from "../foxbot/core/query";

class FixedDate implements Query<Date> {
  constructor(private readonly d: Date) {}
  async value(): Promise<Date> {
    return this.d;
  }
}

describe("builders", () => {
  it("LessThan compares two numbers", async () => {
    expect.assertions(1);
    const five: Query<number> = { value: async () => 5 };
    const ten: Query<number> = { value: async () => 10 };
    const result = await new LessThan(five, ten).value();
    expect(result, "LessThan did not return true for 5 < 10").toBe(true);
  });

  it("DaysBetween computes whole-day delta", async () => {
    expect.assertions(1);
    const a = new FixedDate(new Date("2024-01-01T00:00:00Z"));
    const b = new FixedDate(new Date("2024-01-11T00:00:00Z"));
    const result = await new DaysBetween(a, b).value();
    expect(result, "DaysBetween did not calculate the correct number of days").toBe(10);
  });
});
