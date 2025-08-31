import { describe, expect, it } from "vitest";
import type { Page } from "playwright";

import { LocationOf } from "#foxbot/page";
import type { Query } from "#foxbot/core";
import { FakeIntegrationSession } from "#tests/fakes/fake-integration-session";

describe("LocationOf", () => {
  it("returns current page URL", async () => {
    expect.assertions(1);
    const session = new FakeIntegrationSession();
    const context = await session.profile();
    const page = await context.newPage();
    await page.goto("https://example.com");
    const pageQuery: Query<Page> = { value: async () => page };
    const location = new LocationOf(pageQuery);
    await expect(
      location.value(),
      "LocationOf did not resolve to the current page URL"
    ).resolves.toBe("https://example.com");
    await context.close();
  });
});
