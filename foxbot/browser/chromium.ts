import { chromium } from "playwright";
import type { Browser } from "playwright";

import { Query } from "#foxbot/core";

/**
 * A query that launches a Chromium browser instance.
 *
 * @example
 * ```typescript
 * const browser = await new Chromium(headless, args).value();
 * ```
 */
export class Chromium implements Query<Browser> {
  /**
   * Creates a new Chromium browser query.
   *
   * @param headless Query that determines if the browser runs headless
   * @param args Query that provides comma-separated launch arguments
   */
  constructor(
    private readonly headless: Query<boolean>,
    private readonly args: Query<string>
  ) {}

  /**
   * Launches the browser with the provided configuration.
   *
   * @returns Promise that resolves to the launched browser
   */
  async value(): Promise<Browser> {
    return chromium.launch({
      headless: await this.headless.value(),
      args: (await this.args.value()).split(","),
    });
  }
}
