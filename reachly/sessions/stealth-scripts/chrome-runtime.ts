/**
 * Spoofs Chrome runtime to mimic a real browser environment.
 */
export function spoofChromeRuntime(): string {
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
