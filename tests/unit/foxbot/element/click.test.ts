import { describe, expect, it } from "vitest";
import type { Query } from "#foxbot/core";
import { Click } from "#foxbot/element/click";

class ProbeLocator {
  clicked = false;
  async click(): Promise<void> {
    this.clicked = true;
  }
}

class ProbeQuery implements Query<ProbeLocator> {
  constructor(readonly locator: ProbeLocator) {}
  async value(): Promise<ProbeLocator> {
    return this.locator;
  }
}

describe("Click", () => {
  it("performs click on the element", async () => {
    expect.assertions(1);
    const locator = new ProbeLocator();
    const query = new ProbeQuery(locator);
    // @ts-expect-error minimal locator type
    const action = new Click(query);
    await action.perform();
    expect(locator.clicked, "Click did not call click on locator").toBe(true);
  });
});
