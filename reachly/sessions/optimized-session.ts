import type { Route } from "playwright";
import type { Session } from "../../foxbot/playwright/session";
import { SessionDecorator } from "./session-decorator";

/**
 * Decorator to set up resource blocking for a session.
 */
export class OptimizedSession extends SessionDecorator {
  constructor(session: Session) {
    super(session);
  }

  async open(): Promise<void> {
    await this.session.open();
    await this.setupResourceBlocking();
  }

  /**
   * Sets up resource blocking to reduce memory usage and improve stealth.
   */
  private async setupResourceBlocking(): Promise<void> {
    const context = await this.browser();
    await context.route("**/*", async (route: Route) => {
      const resourceType = route.request().resourceType();
      const url = route.request().url();
      const shouldBlock = this.isResourceBlocked(resourceType, url);
      if (shouldBlock) {
        await route.abort();
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Determines if a resource should be blocked based on type and URL patterns.
   */
  private isResourceBlocked(resourceType: string, url: string): boolean {
    const defaultBlockedTypes = ["image", "font", "media"];
    const defaultBlockedPatterns = [
      /analytics/i,
      /tracking/i,
      /ads/i,
      /doubleclick/i,
      /googletagmanager/i,
      /google-analytics/i,
      /facebook\.net/i,
      /twitter\.com/i,
      /linkedin\.com.*\/analytics/i,
      /linkedin\.com.*\/pixel/i,
    ] as const;
    if (defaultBlockedTypes.includes(resourceType)) {
      return true;
    }
    return defaultBlockedPatterns.some((pattern) => pattern.test(url));
  }
}
