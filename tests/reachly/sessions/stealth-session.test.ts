import { describe, it, expect } from "vitest";
import { StealthSession } from "../../../reachly/sessions/stealth-session";
import type { Session } from "../../../foxbot/playwright/session";
import type { SessionData } from "../../../reachly/sessions/session-data";
import type { BrowserContext } from "playwright";
import { chromium } from "playwright";

/**
 * Fake session implementation for testing stealth session behavior.
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
  const randomId = Math.random().toString(36).substring(2, 12);
  return {
    li_at: `秘密_li_at_${randomId}`,
    JSESSIONID: `秘密_session_${randomId}`,
    userAgent: "Mozilla/5.0 (测试浏览器)",
    viewportWidth: 1366,
    viewportHeight: 768,
    timezone: "Asia/Tokyo",
    locale: "ja-JP",
    platform: "Win32",
    deviceMemory: 8,
    hardwareConcurrency: 4,
    screenWidth: 1920,
    screenHeight: 1080,
    webglVendor: "Google Inc.",
    webglRenderer: "ANGLE (Intel(R) HD Graphics 630)",
  };
}

describe("StealthSession", () => {
  it("calls wrapped session open method", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(context, "StealthSession did not call wrapped session open method").toBeDefined();
  });

  it("injects stealth scripts after opening session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(
      context,
      "StealthSession did not inject stealth scripts after opening session"
    ).toBeDefined();
  });

  it("delegates browser method to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(
      context,
      "StealthSession did not delegate browser method to wrapped session"
    ).toBeDefined();
  });

  it("delegates disposal to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    await stealthSession[Symbol.asyncDispose]();
    expect(true, "StealthSession did not delegate disposal to wrapped session").toBe(true);
  });

  it("handles session data with unicode locale", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData: SessionData = {
      ...createTestSessionData(),
      locale: "繁體中文-TW",
    };
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(context, "StealthSession did not handle session data with unicode locale").toBeDefined();
  });

  it("handles session data with unicode platform", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData: SessionData = {
      ...createTestSessionData(),
      platform: "Linux_测试平台",
    };
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(
      context,
      "StealthSession did not handle session data with unicode platform"
    ).toBeDefined();
  });

  it("handles minimal session data without optional properties", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData: SessionData = {
      li_at: "minimal_li_at",
      JSESSIONID: "minimal_session",
      userAgent: "MinimalAgent/1.0",
      viewportWidth: 800,
      viewportHeight: 600,
      timezone: "UTC",
      locale: "en-US",
    };
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession[Symbol.asyncDispose]();
    expect(
      context,
      "StealthSession did not handle minimal session data without optional properties"
    ).toBeDefined();
  });

  it("extends session decorator correctly", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    expect(
      stealthSession,
      "StealthSession did not extend session decorator correctly"
    ).toBeInstanceOf(StealthSession);
  });

  it("throws error when browser called before open", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await expect(stealthSession.browser()).rejects.toThrow("Session not open");
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const sessionData = createTestSessionData();
    const stealthSession = new StealthSession(fakeSession, sessionData);
    await expect(stealthSession.open()).resolves.not.toThrow();
  });
});
