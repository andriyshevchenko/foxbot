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
import type { BrowserContext } from "playwright";

import type { Session } from "#foxbot/session";

export class FakeCoreSession implements Session {
  async profile(): Promise<BrowserContext> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context: any = {
      newPage: async () => ({}),
      pages: () => [{}],
    };
    return context;
  }
}
