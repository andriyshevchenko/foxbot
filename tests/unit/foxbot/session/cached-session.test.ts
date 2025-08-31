import { describe, expect, it } from "vitest";
import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import { CachedSession } from "#foxbot/session/cached-session";

class BaseSession implements Session {
  count = 0;
  async profile(): Promise<BrowserContext> {
    this.count++;
    // @ts-expect-error minimal context
    return {};
  }
}

describe("CachedSession", () => {
  it("returns same context for repeated calls", async () => {
    expect.assertions(1);
    const base = new BaseSession();
    const cached = new CachedSession(base);
    const first = await cached.profile();
    const second = await cached.profile();
    expect(base.count === 1 && first === second, "CachedSession did not memoize context").toBe(
      true
    );
  });
});
