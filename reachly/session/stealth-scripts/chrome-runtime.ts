import type { Query } from "#foxbot/core";

/**
 * Produces a script spoofing the chrome.runtime object.
 *
 * @example
 * ```typescript
 * const q = new ChromeRuntime();
 * const s = await q.value();
 * ```
 */
export class ChromeRuntime implements Query<string> {
  constructor(
    private readonly code: string = `Object.defineProperty(window, "chrome", {
  get: () => ({
    runtime: { onConnect: undefined, onMessage: undefined }
  })
});`
  ) {}
  async value(): Promise<string> {
    return this.code;
  }
}
