import type { Browser, BrowserContext } from "playwright";

import { Query } from "../../foxbot/core/query";
import type { Session } from "../../foxbot/session";
import { Host } from "./host";
import { Location } from "./location";
import { Viewport } from "./viewport";

/**
 * Default LinkedIn Playwright session.
 * It sets up the browser context with user-agent, viewport, timezone, locale, etc.
 */
export class DefaultSession implements Session {
  private contextInstance: BrowserContext | undefined;
  private initialized = false;

  constructor(
    private readonly viewport: Viewport,
    private readonly hostConfig: Host,
    private readonly location: Location,
    private readonly browser_instance: Query<Browser>
  ) {}

  /**
   * Opens a new Chromium browser session with LinkedIn-specific configuration.
   */
  async open(): Promise<void> {
    const defaultHttpHeaders = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": (await this.hostConfig.locale()) + ",en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
    } as const;
    const httpHeaders = (await this.hostConfig.headers())
      ? { ...defaultHttpHeaders, ...(await this.hostConfig.headers()) }
      : defaultHttpHeaders;
    const browser = await this.browser_instance.value();
    this.contextInstance = await browser.newContext({
      userAgent: await this.hostConfig.userAgent(),
      viewport: {
        width: await this.viewport.width(),
        height: await this.viewport.height(),
      },
      screen: {
        width: await this.viewport.screenWidth(),
        height: await this.viewport.screenHeight(),
      },
      deviceScaleFactor: (await this.viewport.devicePixelRatio()) || 1,
      timezoneId: await this.hostConfig.timezone(),
      locale: await this.hostConfig.locale(),
      permissions: ["geolocation"] as const,
      geolocation: {
        latitude: (await this.location.latitude()) || 40.7128,
        longitude: (await this.location.longitude()) || -74.006,
      },
      extraHTTPHeaders: httpHeaders,
    });
    this.initialized = true;
  }

  /**
   * Returns the browser context instance.
   */
  async host(): Promise<BrowserContext> {
    if (!this.initialized || !this.contextInstance) {
      throw new Error("Session is not open and context is unavailable - call open() method first");
    }
    return this.contextInstance;
  }

  /**
   * Cleans up browser resources by closing context.
   */
  async close(): Promise<void> {
    if (this.initialized && this.contextInstance) {
      await this.contextInstance.close();
    }
  }
}
