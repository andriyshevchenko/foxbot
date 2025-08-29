import type { BrowserContext, Page } from "playwright";
import type { Session } from "../../foxbot/session";

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
  async profile(): Promise<BrowserContext> {
    return {
      newPage: async () => ({}) as Page,
      pages: () => [{} as Page],
    } as unknown as BrowserContext;
  }
}
