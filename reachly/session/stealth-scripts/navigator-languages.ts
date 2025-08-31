import type { Query } from "#foxbot/core";

/**
 * Generates a script spoofing navigator.languages.
 *
 * @example
 * ```typescript
 * const q = new NavigatorLanguages("en-US");
 * const s = await q.value();
 * ```
 */
export class NavigatorLanguages implements Query<string> {
  constructor(private readonly locale: string) {}
  async value(): Promise<string> {
    const root = this.locale.split("-")[0];
    const code = `Object.defineProperty(navigator, "languages", {
  get: () => ["${this.locale}", "${root}"]
});`;
    return code;
  }
}
