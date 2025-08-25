import type { BrowserContext } from "playwright";
import { chromium } from "playwright";
import type { Session } from "../../../foxbot/playwright/session";

/**
 * Fake session implementation for integration testing of session decorators.
 * Creates a real chromium browser context for testing session behavior.
 *
 * @example
 * ```typescript
 * const session = new FakeIntegrationSession();
 * await session.open();
 * const context = await session.browser();
 * ```
 */
export class FakeIntegrationSession implements Session {
  private contextInstance: BrowserContext | undefined;
  private disposed = false;

  /**
   * Opens the session by launching a real chromium browser.
   *
   * @returns Promise that resolves when browser context is created
   */
  async open(): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    this.contextInstance = await browser.newContext();
  }

  /**
   * Returns the browser context.
   *
   * @returns Promise resolving to BrowserContext
   * @throws Error if session is not open
   */
  async browser(): Promise<BrowserContext> {
    if (!this.contextInstance) {
      throw new Error("Session not open");
    }
    return this.contextInstance;
  }

  /**
   * Closes the session and browser context.
   *
   * @returns Promise that resolves when session is closed
   */
  async close(): Promise<void> {
    if (this.contextInstance) {
      await this.contextInstance.close();
      this.contextInstance = undefined;
      this.disposed = true;
    }
  }

  /**
   * Returns whether the session has been disposed.
   *
   * @returns True if session has been closed, false otherwise
   */
  isDisposed(): boolean {
    return this.disposed;
  }
}
