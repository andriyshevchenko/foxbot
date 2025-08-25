/**
 * Spoofs navigator plugins to include realistic browser plugins.
 */
export function spoofNavigatorPlugins(pluginLength: number): string {
  return `
    Object.defineProperty(navigator, "plugins", {
      get: () => [
        {
          0: {
            type: "application/x-google-chrome-pdf",
            suffixes: "pdf",
            description: "Portable Document Format",
            enabledPlugin: null,
          },
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: ${pluginLength},
          name: "Chrome PDF Plugin",
        },
      ],
    });
  `;
}
