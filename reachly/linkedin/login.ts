import { ActionDecorator, Delay, Sequence } from "#foxbot/control";
import { Click, Fill, Locator } from "#foxbot/element";
import { Navigate, PageOf } from "#foxbot/page";
import { Base64, Environment, NumberLiteral, RandomDelay, TextLiteral } from "#foxbot/value";
import type { Session } from "#foxbot/session";

/**
 * LinkedIn login workflow that authenticates using credentials from environment variables.
 * Uses base64-encoded LINKEDIN_USERNAME and LINKEDIN_PASSWORD environment variables.
 * Implements anti-detection measures with appropriate timing delays.
 *
 * @example
 * ```typescript
 * const login = new LinkedInLogin(session);
 * await login.perform();
 * ```
 */
export class LinkedInLogin extends ActionDecorator {
  private static readonly HUMAN_DELAY_MIN = 800;
  private static readonly HUMAN_DELAY_MAX = 1500;
  private static readonly PAGE_LOAD_TIMEOUT = 3000;
  private static readonly LOGIN_URL = "https://www.linkedin.com/login";

  /**
   * Creates a new LinkedIn login workflow.
   *
   * @param session The browser session to use for login
   */
  constructor(session: Session) {
    const page = new PageOf(session);
    const username = new Base64(new Environment("LINKEDIN_USERNAME"));
    const password = new Base64(new Environment("LINKEDIN_PASSWORD"));
    const humanDelay = new RandomDelay(
      new NumberLiteral(LinkedInLogin.HUMAN_DELAY_MIN),
      new NumberLiteral(LinkedInLogin.HUMAN_DELAY_MAX)
    );

    const workflow = new Sequence([
      new Navigate(page, new TextLiteral(LinkedInLogin.LOGIN_URL)),
      new Delay(new NumberLiteral(LinkedInLogin.PAGE_LOAD_TIMEOUT)),
      new Fill(new Locator(page, 'input[name="session[email]"]'), username),
      new Delay(humanDelay),
      new Fill(new Locator(page, 'input[name="session[password]"]'), password),
      new Delay(humanDelay),
      new Click(new Locator(page, 'button[type="submit"]')),
      new Delay(new NumberLiteral(LinkedInLogin.PAGE_LOAD_TIMEOUT)),
    ]);

    super(workflow);
  }
}
