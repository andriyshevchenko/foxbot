import { describe, it, expect } from "vitest";
import { NumberLiteral } from "../foxbot/core/number";
import { BooleanLiteral } from "../foxbot/core/boolean";

describe("core literals", () => {
  it("NumberLiteral returns its number", async () => {
    expect.assertions(1);
    const result = await new NumberLiteral(42).value();
    expect(result, "NumberLiteral did not return the expected number value").toBe(42);
  });

  it("BooleanLiteral returns its boolean", async () => {
    expect.assertions(1);
    const result = await new BooleanLiteral(true).value();
    expect(result, "BooleanLiteral did not return the expected boolean value").toBe(true);
  });
});
