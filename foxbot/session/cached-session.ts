import type { BrowserContext } from "playwright";
import type { Session } from "./session";

/**
 * Caches a single BrowserContext instance for an underlying session to prevent repeated launches.
 * It memoizes the first resolved context and returns the same instance on every subsequent call to profile.
 * This eliminates duplicate browser contexts when multiple components (e.g. guards, queries, actions) invoke profile.
 *
 * @example
 * ```typescript
 * const base: Session = new DefaultSession(viewport, host, location, browserQuery);
 * const cached: Session = new CachedSession(base);
 * const contextA = await cached.profile();
 * const contextB = await cached.profile(); // same object as contextA
 * ```
 */
export class CachedSession implements Session {
  private context?: BrowserContext;
  constructor(private readonly base: Session) {}
  async profile(): Promise<BrowserContext> {
    if (!this.context) {
      this.context = await this.base.profile();
    }
    return this.context;
  }
}
