import type { BrowserContext, Route } from "playwright";
import type { Session } from "./session";

/**
 * Decorator that blocks unnecessary network requests for a session.
 *
 * @example
 * ```typescript
 * const optimized = new OptimizedSession(session);
 * const context = await optimized.profile();
 * ```
 */
export class OptimizedSession implements Session {
  /**
   * Creates a new optimized session.
   *
   * @param session Base session to decorate
   */
  constructor(private readonly session: Session) {}

  /**
   * Provides a browser context with resource blocking enabled.
   *
   * @returns Promise that resolves to the optimized browser context
   */
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
   * Checks if a resource should be blocked.
   *
   * @param resourceType Resource type of the request
   * @param url Request URL
   * @returns True when the resource must be blocked
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
