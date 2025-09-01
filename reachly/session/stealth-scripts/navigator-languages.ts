import { Query } from "#foxbot/core";
import type { Host } from "#reachly/session/host";

/**
 * Spoofs navigator languages based on host locale.
 */
export class NavigatorLanguages implements Query<string> {
  constructor(private readonly host: Host) {}
  async value(): Promise<string> {
    const localeString = await this.host.locale();
    const localeParts = localeString.split("-");
    return `
      Object.defineProperty(navigator, "languages", { get: () => ["${localeString}", "${localeParts[0]}"] });
    `;
  }
}
