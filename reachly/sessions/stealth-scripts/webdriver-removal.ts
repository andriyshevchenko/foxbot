/**
 * Removes webdriver property from navigator to avoid detection.
 */
export function removeWebDriverProperty(): string {
  return `
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  `;
}
