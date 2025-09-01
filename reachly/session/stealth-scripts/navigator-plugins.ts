import { Query } from "#foxbot/core";

/**
 * Spoofs navigator plugins to include realistic browser plugins.
 */
export class NavigatorPlugins implements Query<string> {
  constructor(private readonly length: Query<number>) {}
  async value(): Promise<string> {
    const length = await this.length.value();
    return `
      Object.defineProperty(navigator, "plugins", {
        get: () => [
          {
            0: { type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format", enabledPlugin: null },
            description: "Portable Document Format",
            filename: "internal-pdf-viewer",
            length: ${length},
            name: "Chrome PDF Plugin",
          },
        ],
      });
    `;
  }
}
