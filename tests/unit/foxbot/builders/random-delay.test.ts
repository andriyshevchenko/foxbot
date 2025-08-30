import { describe, expect, it } from "vitest";
import { NumberLiteral } from "#foxbot/value/number_literal";
import { RandomDelay } from "#foxbot/value/random_delay";

describe("RandomDelay", () => {
  it("returns delay above minimum bound", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(5), new NumberLiteral(15));
    const result = await delay.value();
    expect(result, "RandomDelay did not generate delay above minimum bound").toBeGreaterThanOrEqual(
      5
    );
  });

  it("returns delay below maximum bound", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(5), new NumberLiteral(15));
    const result = await delay.value();
    expect(result, "RandomDelay did not generate delay below maximum bound").toBeLessThan(15);
  });

  it("returns delay above zero minimum", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(0), new NumberLiteral(10));
    const result = await delay.value();
    expect(result, "RandomDelay did not handle zero minimum correctly").toBeGreaterThanOrEqual(0);
  });

  it("returns delay below maximum with zero minimum", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(0), new NumberLiteral(10));
    const result = await delay.value();
    expect(
      result,
      "RandomDelay did not generate delay below maximum with zero minimum"
    ).toBeLessThan(10);
  });

  it("returns same value when min equals max", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(42), new NumberLiteral(42));
    const result = await delay.value();
    expect(result, "RandomDelay did not return exact value when min equals max").toBe(42);
  });

  it("returns different values on multiple calls", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(1), new NumberLiteral(100));
    const results = await Promise.all([
      delay.value(),
      delay.value(),
      delay.value(),
      delay.value(),
      delay.value(),
    ]);
    const uniqueResults = new Set(results);
    expect(
      uniqueResults.size,
      "RandomDelay did not generate different values on multiple calls"
    ).toBeGreaterThan(1);
  });

  it("returns delay above large minimum", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(999), new NumberLiteral(1000));
    const result = await delay.value();
    expect(result, "RandomDelay did not handle large minimum correctly").toBeGreaterThanOrEqual(
      999
    );
  });

  it("returns delay below large maximum", async () => {
    expect.assertions(1);
    const delay = new RandomDelay(new NumberLiteral(999), new NumberLiteral(1000));
    const result = await delay.value();
    expect(result, "RandomDelay did not handle large maximum correctly").toBeLessThan(1000);
  });
});
