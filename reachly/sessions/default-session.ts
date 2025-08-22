import type { Browser, BrowserContext } from "playwright";

import type { Session } from "../../foxbot/playwright/session";
import { Query } from "../../foxbot/core/query";
import { SessionData } from "./session-data";

/**
 * Default LinkedIn Playwright session.
 * It sets up the browser context with user-agent, viewport, timezone, locale, etc.
 */
export class DefaultSession implements Session {
  private contextInstance: BrowserContext | undefined;
  private initialized = false;

  constructor(
    private readonly sessionData: SessionData,
    private readonly browser_instance: Query<Browser>
  ) {}

  /**
   * Opens a new Chromium browser session with LinkedIn-specific configuration.
   */
  async open(): Promise<void> {
    const sessionData = this.sessionData;
    const defaultHttpHeaders = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": sessionData.locale + ",en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
    } as const;
    const httpHeaders = sessionData.httpHeaders
      ? { ...defaultHttpHeaders, ...sessionData.httpHeaders }
      : defaultHttpHeaders;
    const browser = await this.browser_instance.value();
    this.contextInstance = await browser.newContext({
      userAgent: sessionData.userAgent,
      viewport: {
        width: sessionData.viewportWidth,
        height: sessionData.viewportHeight,
      },
      screen: {
        width: sessionData.screenWidth || sessionData.viewportWidth,
        height: sessionData.screenHeight || sessionData.viewportHeight,
      },
      deviceScaleFactor: sessionData.devicePixelRatio || 1,
      timezoneId: sessionData.timezone,
      locale: sessionData.locale,
      permissions: ["geolocation"] as const,
      geolocation: {
        latitude: sessionData.latitude || 40.7128,
        longitude: sessionData.longitude || -74.006,
      },
      extraHTTPHeaders: httpHeaders,
    });
    this.initialized = true;
  }

  /**
   * Returns the browser context instance.
   */
  async browser(): Promise<BrowserContext> {
    if (!this.initialized || !this.contextInstance) {
      throw new Error("Session is not open and context is unavailable - call open() method first");
    }
    return this.contextInstance;
  }

  /**
   * Cleans up browser resources by closing context.
   */
  async [Symbol.asyncDispose](): Promise<void> {
    if (this.initialized && this.contextInstance) {
      await this.contextInstance.close();
    }
  }
}
