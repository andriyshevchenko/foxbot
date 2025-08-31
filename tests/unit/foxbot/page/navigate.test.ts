import { describe, expect, it } from "vitest";
import type { Query } from "#foxbot/core";
import { Navigate } from "#foxbot/page/navigate";

class PageStub {
  seen = "";
  async goto(link: string): Promise<void> {
    this.seen = link;
  }
}

class PageQuery implements Query<PageStub> {
  constructor(private readonly page: PageStub) {}
  async value(): Promise<PageStub> {
    return this.page;
  }
}

class UrlQuery implements Query<string> {
  constructor(private readonly link: string) {}
  async value(): Promise<string> {
    return this.link;
  }
}

describe("Navigate", () => {
  it("navigates page to url", async () => {
    expect.assertions(1);
    const page = new PageStub();
    const pageQuery = new PageQuery(page);
    const url = new UrlQuery("https://δ");
    // @ts-expect-error minimal page type
    const navigate = new Navigate(pageQuery, url);
    await navigate.perform();
    expect(page.seen, "Navigate did not call goto with url").toBe("https://δ");
  });
});
