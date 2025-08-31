import { describe, expect, it } from "vitest";
import { TextOf } from "#foxbot/element/text_of";
import type { Query } from "#foxbot/core";

class ProbeLocator {
  async textContent(): Promise<string> {
    return " ξ ";
  }
}

class LocatorQuery implements Query<ProbeLocator> {
  constructor(private readonly locator: ProbeLocator) {}
  async value(): Promise<ProbeLocator> {
    return this.locator;
  }
}

class EmptyLocator {
  async textContent(): Promise<boolean> {
    return false;
  }
}

class EmptyQuery implements Query<EmptyLocator> {
  constructor(private readonly locator: EmptyLocator) {}
  async value(): Promise<EmptyLocator> {
    return this.locator;
  }
}

describe("TextOf", () => {
  it("extracts trimmed text content", async () => {
    expect.assertions(1);
    const locator = new ProbeLocator();
    const query = new LocatorQuery(locator);
    // @ts-expect-error minimal locator type
    const textOf = new TextOf(query);
    const result = await textOf.value();
    expect(result, "TextOf did not return trimmed content").toBe("ξ");
  });

  it("returns empty string when locator text is not string", async () => {
    expect.assertions(1);
    const locator = new EmptyLocator();
    const query = new EmptyQuery(locator);
    // @ts-expect-error minimal locator type
    const textOf = new TextOf(query);
    const result = await textOf.value();
    expect(result, "TextOf did not return empty string").toBe("");
  });
});
