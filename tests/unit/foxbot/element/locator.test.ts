import { describe, expect, it } from "vitest";
import type { Query } from "#foxbot/core";
import { Locator } from "#foxbot/element/locator";

class ProbePage {
  seen = "";
  target: object = {};
  locator(selector: string): object {
    this.seen = selector;
    return this.target;
  }
}

class PageQuery implements Query<ProbePage> {
  constructor(private readonly page: ProbePage) {}
  async value(): Promise<ProbePage> {
    return this.page;
  }
}

describe("Locator", () => {
  it("returns locator from page selector", async () => {
    expect.assertions(1);
    const page = new ProbePage();
    const query = new PageQuery(page);
    const selector = "#æ";
    // @ts-expect-error minimal page type
    const locator = new Locator(query, selector);
    const element = await locator.value();
    expect(
      page.seen === selector && element === page.target,
      "Locator did not return element from page"
    ).toBe(true);
  });
});
