import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import { FakeBrowserContext } from "./fake-browser-context";

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
    const context = new FakeBrowserContext();
    // @ts-expect-error returning fake context
    return context;
  }
}
