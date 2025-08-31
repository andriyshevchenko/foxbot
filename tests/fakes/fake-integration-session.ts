import type { BrowserContext } from "playwright";
import { chromium } from "playwright";
import type { Session } from "#foxbot/session";

/**
 * Fake session implementation for integration style tests that need a real
 * Playwright browser context. Lazily creates a chromium context the first
 * time `profile()` is invoked to align with the simplified Session contract.
 *
 * @example
 * ```typescript
 * const session = new FakeIntegrationSession();
 * const context = await session.profile();
 * ```
 */
export class FakeIntegrationSession implements Session {
  private contextInstance!: BrowserContext;
  private hasContext = false;

  async profile(): Promise<BrowserContext> {
    if (!this.hasContext) {
      const browser = await chromium.launch({ headless: true });
      this.contextInstance = await browser.newContext();
      this.hasContext = true;
    }
    return this.contextInstance;
  }
}
