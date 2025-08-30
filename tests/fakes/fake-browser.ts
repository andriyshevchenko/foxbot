import { FakeBrowserContext } from "./fake-browser-context";

export class FakeBrowser {
  async value() {
    return {
      newContext: async (options?: { viewport?: { width: number; height: number } }) =>
        new FakeBrowserContext(options?.viewport),
    };
  }
}
