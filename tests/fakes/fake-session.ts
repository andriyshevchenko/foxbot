import type { BrowserContext } from "playwright";
import { chromium } from "playwright";
import type { Query } from "#foxbot/core/query";
import type { Session } from "#foxbot/session";

/**
 * Fake session implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeSession();
 * const context = await session.profile();
 * ```
 */
export class FakeSession implements Session {
  private readonly context: BrowserContext[] = [];
  async profile(): Promise<BrowserContext> {
    if (this.context.length === 0) {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      this.context.push(context);
    }
    return this.context[0];
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
  return { value: () => Promise.resolve(new FakeSession()) };
}
