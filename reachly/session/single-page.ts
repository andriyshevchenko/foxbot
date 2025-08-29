import { BrowserContext } from "playwright";
import type { Session } from "../../foxbot/session";

/**
 * Decorator that creates a single Playwright page in the browser context.
 */
export class SinglePage implements Session {
  constructor(private readonly session: Session) {}

  async profile(): Promise<BrowserContext> {
    const context = await this.session.profile();
    await context.newPage();
    return context;
  }
}
