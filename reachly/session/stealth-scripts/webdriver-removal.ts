import type { Query } from "#foxbot/core";

/**
 * Removes navigator.webdriver indicator.
 *
 * @example
 * ```typescript
 * const q = new WebDriverRemoval();
 * const s = await q.value();
 * ```
 */
export class WebDriverRemoval implements Query<string> {
  constructor(
    private readonly code: string = `Object.defineProperty(navigator, "webdriver", {
  get: () => undefined
});`
  ) {}
  async value(): Promise<string> {
    return this.code;
  }
}
