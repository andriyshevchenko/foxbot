import { describe, expect, it } from "vitest";
import type { BrowserContext, Page } from "playwright";
import type { Session } from "#foxbot/session";
import { PageOf } from "#foxbot/page/page_of";

class Context {
  constructor(private readonly list: Page[]) {}
  pages(): Page[] {
    return this.list;
  }
}

class BaseSession implements Session {
  constructor(private readonly ctx: Context) {}
  async profile(): Promise<BrowserContext> {
    // @ts-expect-error minimal context
    return this.ctx;
  }
}

class PageStub {}

describe("PageOf", () => {
  it("returns first page from session context", async () => {
    expect.assertions(1);
    const page = new PageStub();
    // @ts-expect-error minimal page type
    const ctx = new Context([page]);
    const session = new BaseSession(ctx);
    const query = new PageOf(session);
    const result = await query.value();
    expect(result === page, "PageOf did not return first page").toBe(true);
  });

  it("throws when context has no pages", async () => {
    expect.assertions(1);
    const ctx = new Context([]);
    const session = new BaseSession(ctx);
    const query = new PageOf(session);
    await expect(query.value(), "PageOf did not throw without pages").rejects.toThrow();
  });
});
