import type { BrowserContext } from "playwright";
import type { Session } from "../../foxbot/playwright/session";

/**
 * Abstract decorator for sessions to extend session functionality.
 */
export abstract class SessionDecorator implements Session {
  constructor(protected session: Session) {}

  abstract open(): Promise<void>;

  browser(): Promise<BrowserContext> {
    return this.session.browser();
  }

  [Symbol.asyncDispose](): Promise<void> {
    return Promise.resolve(this.session[Symbol.asyncDispose]());
  }
}
