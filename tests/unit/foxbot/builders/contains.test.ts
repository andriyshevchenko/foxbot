import { describe, expect, it } from "vitest";
import { Contains, TextLiteral } from "#foxbot/value";

describe("Contains", () => {
  it("returns true when haystack contains needle", async () => {
    expect.assertions(1);
    const query = new Contains(new TextLiteral("hello world"), new TextLiteral("world"));
    await expect(
      query.value(),
      "Contains did not evaluate to true when haystack contained needle"
    ).resolves.toBe(true);
  });

  it("returns false when haystack does not contain needle", async () => {
    expect.assertions(1);
    const query = new Contains(new TextLiteral("hello world"), new TextLiteral("foo"));
    await expect(
      query.value(),
      "Contains evaluated to true when haystack lacked needle"
    ).resolves.toBe(false);
  });
});
