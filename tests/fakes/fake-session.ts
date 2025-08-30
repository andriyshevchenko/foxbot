import { FakeBrowserContext } from "./fake-browser-context";
import { FakePage } from "./fake-page";

/**
 * Fake session implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeSession();
 * const page = await session.page();
 * ```
 */
export class FakeSession {
  private readonly fakePage = new FakePage();
  private readonly fakeBrowserContext = new FakeBrowserContext();

  profile() {
    return Promise.resolve(this.fakeBrowserContext);
  }

  page(): Promise<FakePage> {
    return Promise.resolve(this.fakePage);
  }
}

/**
 * Creates a session query that returns a fake session.
 * Used for testing workflows that depend on sessions.
 *
 * @example
 * ```typescript
 * const sessionQuery = fakeSession();
 * const session = await sessionQuery.value();
 * ```
 */
export function fakeSession() {
  return {
    value: () => Promise.resolve(new FakeSession()),
  };
}
