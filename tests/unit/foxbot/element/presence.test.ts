import { describe, expect, it } from "vitest";
import type { Query } from "#foxbot/core";
import { Presence } from "#foxbot/element/presence";

class ProbeLocator {
  async count(): Promise<number> {
    return 1;
  }
}

class LocatorQuery implements Query<ProbeLocator> {
  constructor(private readonly locator: ProbeLocator) {}
  async value(): Promise<ProbeLocator> {
    return this.locator;
  }
}

describe("Presence", () => {
  it("reports true when locator count exceeds zero", async () => {
    expect.assertions(1);
    const locator = new ProbeLocator();
    const query = new LocatorQuery(locator);
    // @ts-expect-error minimal locator type
    const presence = new Presence(query);
    const result = await presence.value();
    expect(result, "Presence did not report element existence").toBe(true);
  });
});
