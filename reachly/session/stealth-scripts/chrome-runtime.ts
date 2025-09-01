import { Query } from "#foxbot/core";

/**
 * Spoofs Chrome runtime to mimic a real browser environment.
 */
export class ChromeRuntime implements Query<string> {
  constructor() {}
  async value(): Promise<string> {
    return `
      Object.defineProperty(window, "chrome", {
        get: () => ({
          runtime: {
            onConnect: undefined,
            onMessage: undefined,
          },
        }),
      });
    `;
  }
}
