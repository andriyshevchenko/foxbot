import type { Route } from "playwright";
import { FakePage } from "./fake-page";

/**
 * Fake browser context implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 */
export class FakeBrowserContext {
  private readonly fakePage: FakePage;
  private readonly storedCookies: {
    name: string;
    value: string;
    secure?: boolean;
    httpOnly?: boolean;
  }[] = [];

  constructor(options: { viewport?: { width: number; height: number } } = {}) {
    const size = options.viewport;
    this.fakePage = new FakePage(size ? size : { width: 0, height: 0 });
  }

  newPage(): Promise<FakePage> {
    return Promise.resolve(this.fakePage);
  }

  pages(): FakePage[] {
    return [this.fakePage];
  }

  async close(): Promise<void> {}

  async addCookies(
    cookies: {
      name: string;
      value: string;
      secure?: boolean;
      httpOnly?: boolean;
    }[]
  ): Promise<void> {
    this.storedCookies.push(...cookies);
  }

  async cookies(): Promise<
    { name: string; value: string; secure?: boolean; httpOnly?: boolean }[]
  > {
    return this.storedCookies;
  }

  async addInitScript(): Promise<void> {}

  async route(_pattern: string, _handler: (route: Route) => Promise<void>): Promise<void> {
    void _pattern;
    void _handler;
  }
}
