import { describe, it, expect } from "vitest";
import { SessionDecorator } from "../../../reachly/sessions/session-decorator";
import type { Session } from "../../../foxbot/playwright/session";
import type { BrowserContext } from "playwright";
import { chromium } from "playwright";

/**
 * Test implementation of SessionDecorator for testing abstract functionality.
 */
class TestSessionDecorator extends SessionDecorator {
  private opened = false;

  async open(): Promise<void> {
    await this.session.open();
    this.opened = true;
  }

  isOpened(): boolean {
    return this.opened;
  }
}

/**
 * Fake session implementation for testing decorator behavior.
 */
class FakeSession implements Session {
  private browserInstance: BrowserContext | undefined;
  private disposed = false;

  async open(): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    this.browserInstance = await browser.newContext();
  }

  async browser(): Promise<BrowserContext> {
    if (!this.browserInstance) {
      throw new Error("Session not open");
    }
    return this.browserInstance;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (this.browserInstance) {
      await this.browserInstance.close();
      this.disposed = true;
    }
  }

  isDisposed(): boolean {
    return this.disposed;
  }
}

describe("SessionDecorator", () => {
  it("delegates browser call to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    const context = await decorator.browser();
    await decorator[Symbol.asyncDispose]();
    expect(
      context,
      "SessionDecorator did not delegate browser call to wrapped session"
    ).toBeDefined();
  });

  it("delegates disposal to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator[Symbol.asyncDispose]();
    expect(
      fakeSession.isDisposed(),
      "SessionDecorator did not delegate disposal to wrapped session"
    ).toBe(true);
  });

  it("calls wrapped session open method", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator.open();
    const context = await decorator.browser();
    await decorator[Symbol.asyncDispose]();
    expect(context, "SessionDecorator did not call wrapped session open method").toBeDefined();
  });

  it("maintains decorator state independently of wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator.open();
    await decorator[Symbol.asyncDispose]();
    expect(
      decorator.isOpened(),
      "SessionDecorator did not maintain decorator state independently"
    ).toBe(true);
  });

  it("handles wrapped session disposal promise correctly", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    const disposePromise = decorator[Symbol.asyncDispose]();
    await disposePromise;
    expect(
      fakeSession.isDisposed(),
      "SessionDecorator did not handle wrapped session disposal promise correctly"
    ).toBe(true);
  });
});
