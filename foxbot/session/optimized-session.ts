import type { BrowserContext, Route } from "playwright";
import type { Session } from "./session";

/**
 * Decorator to set up resource blocking for a session.
 */
export class OptimizedSession implements Session {
  constructor(private readonly session: Session) {}

  async profile(): Promise<BrowserContext> {
    const context = await this.session.profile();
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
    return context;
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
