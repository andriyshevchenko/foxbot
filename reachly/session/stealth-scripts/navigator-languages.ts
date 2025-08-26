/**
 * Spoofs navigator languages based on host locale.
 */
export function spoofNavigatorLanguages(): string {
  return `
    const localeString = await sessionData.host.locale();
    const localeParts = localeString.split("-");
    Object.defineProperty(navigator, "languages", {
      get: () => [localeString, localeParts[0]],
    });
  `;
}
