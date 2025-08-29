import { Query } from "#foxbot/core";

/**
 * A query that determines if the browser should run in headless mode.
 *
 * @example
 * ```typescript
 * const headless = new Headless();
 * const enabled = await headless.value();
 * ```
 */
export class Headless implements Query<boolean> {
  /**
   * Creates a headless mode query.
   */
  constructor() {}

  /**
   * Indicates whether headless mode is enabled.
   *
   * @returns Promise that resolves to true when headless is enabled
   */
  async value(): Promise<boolean> {
    return process.env["HEADLESS"] === "true";
  }
}
