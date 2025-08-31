import type { Browser } from "playwright";

import { FakeBrowserContext } from "./fake-browser-context";

export class FakeBrowser {
  async value(): Promise<Browser> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const browser: any = {
      newContext: async (options?: { viewport?: { width: number; height: number } }) =>
        new FakeBrowserContext(options?.viewport),
    };
    return browser;
  }
}
