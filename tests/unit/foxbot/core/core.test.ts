import { describe, expect, it } from "vitest";

import { BooleanLiteral, NumberLiteral } from "#foxbot/core";

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
