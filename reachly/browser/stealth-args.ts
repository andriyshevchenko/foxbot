import { Query } from "../../foxbot/core";

/**
 * A query that returns Chromium launch arguments for stealth mode.
 *
 * @example
 * ```typescript
 * const args = await new StealthArgs().value();
 * ```
 */
export class StealthArgs implements Query<string> {
  /**
   * Creates a stealth arguments query.
   */
  constructor() {}

  /**
   * Provides comma-separated launch arguments.
   *
   * @returns Promise that resolves to the launch argument string
   */
  async value(): Promise<string> {
    const defaultChromeArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ];
    return defaultChromeArgs.join(",");
  }
}
