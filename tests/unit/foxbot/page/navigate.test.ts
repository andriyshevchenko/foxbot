import { describe, it, expect } from "vitest";

import { Navigate } from "#foxbot/page/navigate";
import { FakePage } from "#tests/fakes";

describe("Navigate", () => {
  it("navigates page to provided url", async () => {
    expect.assertions(1);
    const page = new FakePage();
    const pageQuery = { value: () => Promise.resolve(page) };
    const urlQuery = { value: () => Promise.resolve("https://example.com") };
    const navigate = new Navigate(pageQuery, urlQuery);
    await navigate.perform();
    expect(page.url(), "Navigate did not navigate to url").toBe("https://example.com");
  });
});
