import { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import { Host } from "./host";

/**
 * Decorator to add authentication cookies to a session.
 */
export class AuthenticatedSession implements Session {
  constructor(
    private readonly session: Session,
    private readonly hostConfig: Host
  ) {}

  async profile(): Promise<BrowserContext> {
    const context = await this.session.profile();
    await context.addCookies(JSON.parse(await this.hostConfig.cookies()));
    return context;
  }
}
