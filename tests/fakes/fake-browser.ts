import type { Browser } from "playwright";
import type { Query } from "#foxbot/core";
import { FakeBrowserContext } from "./fake-browser-context";

/**
 * Fake browser query implementation for session testing purposes.
 * Returns a fake browser object that never launches a real browser.
 */
export class FakeBrowser implements Query<Browser> {
  async value(): Promise<Browser> {
    const create = async (options: { viewport?: { width: number; height: number } } = {}) =>
      new FakeBrowserContext(options);
    // @ts-expect-error returning fake browser object
    return { newContext: create };
  }
}
