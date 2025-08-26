import type { Session } from "../../foxbot/playwright/session";
import { SessionDecorator } from "./session-decorator";

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
