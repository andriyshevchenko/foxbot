import type { BrowserContext, Page } from "playwright";
import type { Session } from "../../foxbot/session";

/**
 * Fake session implementation for foxbot core testing purposes.
 * Only implements methods actually used in foxbot core tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeCoreSession();
 * await session.open();
 * ```
 */
export class FakeCoreSession implements Session {
  /**
   * Opens the fake session.
   *
   * @returns Promise that resolves immediately
   */
  async open(): Promise<void> {
    // No-op for test
  }

  /**
   * Returns a fake browser context.
   *
   * @returns Promise resolving to fake BrowserContext
   */
  async host(): Promise<BrowserContext> {
    return {
      newPage: async () => ({}) as Page,
      pages: () => [{} as Page],
    } as unknown as BrowserContext;
  }

  /**
   * Closes the fake session.
   *
   * @returns Promise that resolves immediately
   */
  async close(): Promise<void> {
    // No-op for test
  }
}
