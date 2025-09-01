import type { BrowserContext } from "playwright";
import type { Query } from "#foxbot/core";
import type { Session } from "#foxbot/session";

/**
 * Decorates a session by injecting stealth scripts produced by queries.
 *
 * @example
 * ```typescript
 * const s = new StealthSession(base, [new WebDriverRemoval()])
 * await s.profile()
 * ```
 */
export class StealthSession implements Session {
  constructor(
    private readonly base: Session,
    private readonly scripts: readonly Query<string>[]
  ) {}
  async profile(): Promise<BrowserContext> {
    const context = await this.base.profile();
    for (const script of this.scripts) {
      const code = await script.value();
      await context.addInitScript(code);
    }
    return context;
  }
}
