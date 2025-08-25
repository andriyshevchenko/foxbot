import type { Session } from "../../foxbot/playwright/session";
import { SessionDecorator } from "./session-decorator";
import { Host } from "./host";

/**
 * Decorator to add authentication cookies to a session.
 */
export class AuthenticatedSession extends SessionDecorator {
  constructor(
    session: Session,
    private readonly host: Host
  ) {
    super(session);
  }

  async open(): Promise<void> {
    await this.session.open();
    await this.addCookiesToContext();
  }

  /**
   * Adds LinkedIn cookies and additional cookies to the browser context.
   */
  private async addCookiesToContext(): Promise<void> {
    const context = await this.browser();
    await context.addCookies(JSON.parse(await this.host.cookies()));
  }
}
