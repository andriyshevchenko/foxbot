import { Query } from "#foxbot/core";

/**
 * Removes webdriver property from navigator to avoid detection.
 */
export class WebDriverRemoval implements Query<string> {
  constructor() {}
  async value(): Promise<string> {
    return `
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    `;
  }
}
