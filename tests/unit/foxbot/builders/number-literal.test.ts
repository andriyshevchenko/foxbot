import { describe, expect, it } from "vitest";
import { NumberLiteral } from "#foxbot/value/number_literal";

describe("NumberLiteral", () => {
  it("returns the provided number value", async () => {
    expect.assertions(1);
    const num = new NumberLiteral(42);
    const result = await num.value();
    expect(result, "NumberLiteral did not return the provided number value").toBe(42);
  });

  it("returns zero when provided", async () => {
    expect.assertions(1);
    const num = new NumberLiteral(0);
    const result = await num.value();
    expect(result, "NumberLiteral did not return zero when provided").toBe(0);
  });

  it("returns negative number when provided", async () => {
    expect.assertions(1);
    const num = new NumberLiteral(-123);
    const result = await num.value();
    expect(result, "NumberLiteral did not return negative number when provided").toBe(-123);
  });

  it("returns decimal number when provided", async () => {
    expect.assertions(1);
    const num = new NumberLiteral(3.14159);
    const result = await num.value();
    expect(result, "NumberLiteral did not return decimal number when provided").toBe(3.14159);
  });

  it("returns very large number when provided", async () => {
    expect.assertions(1);
    const largeNum = 9007199254740991;
    const num = new NumberLiteral(largeNum);
    const result = await num.value();
    expect(result, "NumberLiteral did not return very large number when provided").toBe(largeNum);
  });
});
