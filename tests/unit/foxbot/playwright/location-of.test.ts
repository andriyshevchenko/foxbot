import { describe, expect, it } from "vitest";
import { LocationOf } from "#foxbot/page";
import { FakePage } from "#tests/fakes/fake-page";

describe("LocationOf", () => {
  it("returns current page URL", async () => {
    expect.assertions(1);
    const page = new FakePage();
    await page.goto("https://example.com");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyPage: any = page;
    const pageQuery = { value: async () => anyPage };
    const location = new LocationOf(pageQuery);
    await expect(
      location.value(),
      "LocationOf did not resolve to the current page URL"
    ).resolves.toBe("https://example.com");
  });
});
