import type { Session } from "../../foxbot/playwright/session";
import { SessionDecorator } from "./session-decorator";
import { SessionData } from "./session-data";

/**
 * Decorator to add authentication cookies to a session.
 */
export class AuthenticatedSession extends SessionDecorator {
  constructor(
    session: Session,
    private readonly sessionData: SessionData
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
    const sessionData = this.sessionData;
    const sameSiteNone = "None" as const;
    const sameSiteLax = "Lax" as const;
    const linkedinCookies = [
      {
        name: "li_at",
        value: sessionData.li_at,
        domain: ".linkedin.com",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: sameSiteNone,
      },
      {
        name: "JSESSIONID",
        value: sessionData.JSESSIONID,
        domain: ".linkedin.com",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: sameSiteNone,
      },
    ];
    const additionalCookies = Object.entries(sessionData.cookies || {}).map(([name, value]) => ({
      name,
      value,
      domain: ".linkedin.com",
      path: "/",
      secure: true,
      sameSite: sameSiteLax,
    }));
    await context.addCookies([...linkedinCookies, ...additionalCookies]);
  }
}
