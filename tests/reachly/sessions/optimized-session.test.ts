import { describe, it, expect } from "vitest";
import { OptimizedSession } from "../../../reachly/sessions/optimized-session";
import type { Session } from "../../../foxbot/playwright/session";
import type { BrowserContext } from "playwright";
import { chromium } from "playwright";

/**
 * Fake session implementation for testing optimized session behavior.
 */
class FakeSession implements Session {
  private contextInstance: BrowserContext | undefined;

  async open(): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    this.contextInstance = await browser.newContext();
  }

  async browser(): Promise<BrowserContext> {
    if (!this.contextInstance) {
      throw new Error("Session not open");
    }
    return this.contextInstance;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (this.contextInstance) {
      await this.contextInstance.close();
    }
  }
}

describe("OptimizedSession", () => {
  it("calls wrapped session open method", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession[Symbol.asyncDispose]();
    expect(context, "OptimizedSession did not call wrapped session open method").toBeDefined();
  });

  it("delegates browser method to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession[Symbol.asyncDispose]();
    expect(
      context,
      "OptimizedSession did not delegate browser method to wrapped session"
    ).toBeDefined();
  });

  it("delegates disposal to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    await optimizedSession[Symbol.asyncDispose]();
    expect(true, "OptimizedSession did not delegate disposal to wrapped session").toBe(true);
  });

  it("creates browser context with route handlers", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession[Symbol.asyncDispose]();
    expect(
      context,
      "OptimizedSession did not create browser context with route handlers"
    ).toBeDefined();
  });

  it("extends session decorator correctly", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    expect(
      optimizedSession,
      "OptimizedSession did not extend session decorator correctly"
    ).toBeInstanceOf(OptimizedSession);
  });

  it("handles browser context creation with unicode paths", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession[Symbol.asyncDispose]();
    expect(
      context,
      "OptimizedSession did not handle browser context creation with unicode paths"
    ).toBeDefined();
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await expect(optimizedSession.open()).resolves.not.toThrow();
  });

  it("throws error when browser called before open", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await expect(optimizedSession.browser()).rejects.toThrow("Session not open");
  });
});
