import { FakePage } from "./fake-page";

/**
 * Fake browser context implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 */
export class FakeBrowserContext {
  private readonly fakePage = new FakePage();

  newPage(): Promise<FakePage> {
    return Promise.resolve(this.fakePage);
  }

  async close(): Promise<void> {
    // No-op for test
  }

  async addCookies(): Promise<void> {
    // No-op for test
  }
}
