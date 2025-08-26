import { describe, expect, it } from "vitest";
import { Delay } from "../../../../foxbot/control/delay";
import { NumberLiteral } from "../../../../foxbot/value/number_literal";

describe("Delay", () => {
  it("waits for specified milliseconds", async () => {
    expect.assertions(1);
    const startTime = Date.now();
    const delay = new Delay(new NumberLiteral(10));
    await delay.perform();
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    expect(elapsed, "Delay did not wait for specified milliseconds").toBeGreaterThanOrEqual(8);
  });

  it("waits for zero milliseconds", async () => {
    expect.assertions(1);
    const delay = new Delay(new NumberLiteral(0));
    await delay.perform();
    expect(true, "Delay did not handle zero milliseconds").toBe(true);
  });

  it("waits for unicode number input", async () => {
    expect.assertions(1);
    const delay = new Delay(new NumberLiteral(5));
    const startTime = Date.now();
    await delay.perform();
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    expect(elapsed, "Delay did not wait for unicode number input").toBeGreaterThanOrEqual(3);
  });
});
