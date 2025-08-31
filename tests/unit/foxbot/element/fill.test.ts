import { describe, expect, it } from "vitest";
import type { Query } from "#foxbot/core";
import { Fill } from "#foxbot/element/fill";

class ProbeLocator {
  content = "";
  async fill(value: string): Promise<void> {
    this.content = value;
  }
}

class LocatorQuery implements Query<ProbeLocator> {
  constructor(readonly locator: ProbeLocator) {}
  async value(): Promise<ProbeLocator> {
    return this.locator;
  }
}

class TextQuery implements Query<string> {
  constructor(private readonly text: string) {}
  async value(): Promise<string> {
    return this.text;
  }
}

describe("Fill", () => {
  it("fills element with provided text", async () => {
    expect.assertions(1);
    const locator = new ProbeLocator();
    const element = new LocatorQuery(locator);
    const text = new TextQuery("Łódź");
    // @ts-expect-error minimal locator type
    const action = new Fill(element, text);
    await action.perform();
    expect(locator.content, "Fill did not apply provided text").toBe("Łódź");
  });
});
