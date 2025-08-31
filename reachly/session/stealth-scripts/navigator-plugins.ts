import type { Query } from "#foxbot/core";

/**
 * Generates script spoofing navigator.plugins.
 *
 * @example
 * ```typescript
 * const q = new NavigatorPlugins(1);
 * const s = await q.value();
 * ```
 */
export class NavigatorPlugins implements Query<string> {
  constructor(private readonly length: number) {}
  async value(): Promise<string> {
    const code = `Object.defineProperty(navigator, "plugins", {
  get: () => [{
    0: {
      type: "application/x-google-chrome-pdf",
      suffixes: "pdf",
      description: "Portable Document Format",
      enabledPlugin: null
    },
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    length: ${this.length},
    name: "Chrome PDF Plugin"
  }]
});`;
    return code;
  }
}
