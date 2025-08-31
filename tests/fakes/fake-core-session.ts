import type { BrowserContext } from "playwright";
import { chromium } from "playwright";
import type { Session } from "#foxbot/session";

/**
 * Fake session implementation for foxbot core testing purposes.
 * Only implements methods actually used in foxbot core tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeCoreSession();
 * const context = await session.profile();
 * ```
 */
export class FakeCoreSession implements Session {
  private readonly context: BrowserContext[] = [];
  async profile(): Promise<BrowserContext> {
    if (this.context.length === 0) {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      await context.newPage();
      this.context.push(context);
    }
    return this.context[0];
  }
}
