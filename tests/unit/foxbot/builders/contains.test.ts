import { describe, expect, it } from "vitest";
import { Contains, TextLiteral } from "../../../../foxbot/value";

describe("Contains", () => {
  it("returns true when haystack contains needle", async () => {
    const query = new Contains(new TextLiteral("hello world"), new TextLiteral("world"));
    await expect(query.value()).resolves.toBe(true);
  });

  it("returns false when haystack does not contain needle", async () => {
    const query = new Contains(new TextLiteral("hello world"), new TextLiteral("foo"));
    await expect(query.value()).resolves.toBe(false);
  });
});
