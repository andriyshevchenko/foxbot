import { describe, expect, it } from "vitest";
import { OptimizedSession } from "#foxbot/session/optimized-session";
import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";

class RouteStub {
  aborted = false;
  continued = false;
  constructor(
    private readonly type: string,
    private readonly link: string
  ) {}
  request() {
    return { resourceType: () => this.type, url: () => this.link };
  }
  async abort(): Promise<void> {
    this.aborted = true;
  }
  async continue(): Promise<void> {
    this.continued = true;
  }
}

class Context {
  handler?: (route: RouteStub) => Promise<void>;
  async route(_pattern: string, cb: (route: RouteStub) => Promise<void>): Promise<void> {
    this.handler = cb;
  }
}

class BaseSession implements Session {
  ctx = new Context();
  async profile(): Promise<BrowserContext> {
    // @ts-expect-error minimal context
    return this.ctx;
  }
}

describe("OptimizedSession", () => {
  it("aborts blocked resource type", async () => {
    expect.assertions(1);
    const base = new BaseSession();
    const opt = new OptimizedSession(base);
    await opt.profile();
    const route = new RouteStub("image", "https://α");
    await base.ctx.handler!(route);
    expect(route.aborted, "OptimizedSession did not abort blocked type").toBe(true);
  });
  it("aborts blocked url pattern", async () => {
    expect.assertions(1);
    const base = new BaseSession();
    const opt = new OptimizedSession(base);
    await opt.profile();
    const route = new RouteStub("document", "https://t/analytics");
    await base.ctx.handler!(route);
    expect(route.aborted, "OptimizedSession did not abort blocked url").toBe(true);
  });
  it("continues unblocked resource", async () => {
    expect.assertions(1);
    const base = new BaseSession();
    const opt = new OptimizedSession(base);
    await opt.profile();
    const route = new RouteStub("script", "https://β");
    await base.ctx.handler!(route);
    expect(route.continued, "OptimizedSession did not continue allowed resource").toBe(true);
  });
});
