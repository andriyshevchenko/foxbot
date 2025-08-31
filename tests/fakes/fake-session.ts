import type { BrowserContext } from "playwright";
import type { Query } from "#foxbot/core/query";
import type { Session } from "#foxbot/session";
import { FakeBrowserContext } from "./fake-browser-context";
import { FakePage } from "./fake-page";

/**
 * Fake session implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeSession();
 * const page = await session.page();
 * ```
 */
export class FakeSession implements Session {
  private readonly fakePage = new FakePage();
  private readonly fakeBrowserContext = new FakeBrowserContext();

  async profile(): Promise<BrowserContext> {
    // @ts-expect-error returning fake context
    return this.fakeBrowserContext;
  }

  page(): Promise<FakePage> {
    return Promise.resolve(this.fakePage);
  }
}

/**
 * Creates a session query that returns a fake session.
 * Used for testing workflows that depend on sessions.
 *
 * @example
 * ```typescript
 * const sessionQuery = fakeSession();
 * const session = await sessionQuery.value();
 * ```
 */
export function fakeSession(): Query<FakeSession> {
  return {
    value: () => Promise.resolve(new FakeSession()),
  };
}
