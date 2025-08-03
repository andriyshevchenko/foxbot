import { describe, it, expect } from "vitest";
import { NumberLiteral } from "../foxbot/core/number";
import { BooleanLiteral } from "../foxbot/core/boolean";

describe("core literals", () => {
  it("NumberLiteral returns its number", async () => {
    expect(await new NumberLiteral(42).value()).toBe(42);
  });
  it("BooleanLiteral returns its boolean", async () => {
    expect(await new BooleanLiteral(true).value()).toBe(true);
  });
});
