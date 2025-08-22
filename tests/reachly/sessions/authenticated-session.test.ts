import { describe, it, expect } from "vitest";
import { chromium } from "playwright";
import type { BrowserContext } from "playwright";

import type { Session } from "../../../foxbot/playwright/session";
import type { SessionData } from "../../../reachly/sessions/session-data";
import { AuthenticatedSession } from "../../../reachly/sessions/authenticated-session";

/**
 * Fake session implementation for testing authenticated session behavior.
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

/**
 * Creates test session data with unicode characters for edge case testing.
 */
function createTestSessionData(): SessionData {
  const randomId = Math.random().toString(36).substring(2, 10);
  return {
    li_at: `тест_li_at_${randomId}`,
    JSESSIONID: `테스트_session_${randomId}`,
    userAgent: "TestAgent/1.0",
    viewportWidth: 1920,
    viewportHeight: 1080,
    timezone: "UTC",
    locale: "en-US",
    cookies: {
      追加_cookie: `値_${randomId}`,
      дополнительный: `значение_${randomId}`,
    },
  };
}

describe("AuthenticatedSession", () => {
  it("calls wrapped session open method", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    await authenticatedSession[Symbol.asyncDispose]();
    expect(context, "AuthenticatedSession did not call wrapped session open method").toBeDefined();
  });

  it("adds LinkedIn cookies to browser context", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    const cookies = await context.cookies();
    await authenticatedSession[Symbol.asyncDispose]();
    const hasLinkedInCookies = cookies.some(
      (cookie) => cookie.name === "li_at" || cookie.name === "JSESSIONID"
    );
    expect(
      hasLinkedInCookies,
      "AuthenticatedSession did not add LinkedIn cookies to browser context"
    ).toBe(true);
  });

  it("adds additional cookies from session data", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    const cookies = await context.cookies();
    await authenticatedSession[Symbol.asyncDispose]();
    const hasAdditionalCookies = cookies.some((cookie) => cookie.name === "追加_cookie");
    expect(
      hasAdditionalCookies,
      "AuthenticatedSession did not add additional cookies from session data"
    ).toBe(true);
  });

  it("sets secure flag on LinkedIn cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    const cookies = await context.cookies();
    await authenticatedSession[Symbol.asyncDispose]();
    const linkedInCookie = cookies.find((cookie) => cookie.name === "li_at");
    expect(
      linkedInCookie?.secure,
      "AuthenticatedSession did not set secure flag on LinkedIn cookies"
    ).toBe(true);
  });

  it("sets httpOnly flag on LinkedIn cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    const cookies = await context.cookies();
    await authenticatedSession[Symbol.asyncDispose]();
    const jsessionCookie = cookies.find((cookie) => cookie.name === "JSESSIONID");
    expect(
      jsessionCookie?.httpOnly,
      "AuthenticatedSession did not set httpOnly flag on LinkedIn cookies"
    ).toBe(true);
  });

  it("handles session data without additional cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData: SessionData = {
      li_at: "test_li_at_value",
      JSESSIONID: "test_session_id",
      userAgent: "TestAgent/1.0",
      viewportWidth: 1920,
      viewportHeight: 1080,
      timezone: "UTC",
      locale: "en-US",
    };
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    await authenticatedSession[Symbol.asyncDispose]();
    expect(
      context,
      "AuthenticatedSession did not handle session data without additional cookies"
    ).toBeDefined();
  });

  it("delegates browser method to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    const context = await authenticatedSession.browser();
    await authenticatedSession[Symbol.asyncDispose]();
    expect(
      context,
      "AuthenticatedSession did not delegate browser method to wrapped session"
    ).toBeDefined();
  });

  it("delegates disposal to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const authenticatedSession = new AuthenticatedSession(fakeSession, sessionData);
    await authenticatedSession.open();
    await authenticatedSession[Symbol.asyncDispose]();
    expect(true, "AuthenticatedSession did not delegate disposal to wrapped session").toBe(true);
  });
});
