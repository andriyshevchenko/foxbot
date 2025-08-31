/* c8 ignore file */
import type { BrowserContext } from "playwright";

/**
 * Interface for managing a Playwright browser session lifecycle.
 * Provides explicit lifecycle management with open and close methods.
 *
 * @example
 * ```typescript
 * const session: Session = new DefaultSession(...);
 * const context = await session.profile();
 * ```
 */
export interface Session {
  /**
   * Returns the Playwright browser context instance.
   * @throws Error if session is not open
   */
  profile(): Promise<BrowserContext>;
}
