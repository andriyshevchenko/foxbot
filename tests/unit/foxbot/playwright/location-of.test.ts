import { describe, expect, it } from "vitest";
import type { Page } from "playwright";

import { LocationOf } from "../../../../foxbot/page";
import type { Query } from "../../../../foxbot/core";
import { FakePage } from "../../../fakes/fake-page";

describe("LocationOf", () => {
  it("returns current page URL", async () => {
    const page = new FakePage();
    await page.goto("https://example.com");
    const pageQuery: Query<Page> = { value: async () => page as unknown as Page };
    const location = new LocationOf(pageQuery);
    await expect(location.value()).resolves.toBe("https://example.com");
  });
});
