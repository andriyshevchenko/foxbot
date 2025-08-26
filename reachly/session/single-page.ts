import type { Session } from "../../foxbot/session";
import { SessionDecorator } from "../../foxbot/session";

/**
 * Decorator that creates a single Playwright page in the browser context.
 */
export class SinglePage extends SessionDecorator {
  constructor(session: Session) {
    super(session);
  }

  async open(): Promise<void> {
    const context = await this.host();
    await context.newPage();
  }
}
