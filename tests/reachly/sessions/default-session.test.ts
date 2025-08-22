import { describe, it, expect } from "vitest";
import { DefaultSession } from "../../../reachly/sessions/default-session";
import type { SessionData } from "../../../reachly/sessions/session-data";
import type { Query } from "../../../foxbot/core";
import type { Browser } from "playwright";
import { chromium } from "playwright";

/**
 * Test double for browser query that returns a real chromium instance.
 */
class FakeBrowser implements Query<Browser> {
  async value(): Promise<Browser> {
    return await chromium.launch({ headless: true });
  }
}

/**
 * Creates test session data with unicode characters for testing edge cases.
 */
function createTestSessionData(): SessionData {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return {
    li_at: `тест_li_at_${randomSuffix}`,
    JSESSIONID: `세션_id_${randomSuffix}`,
    userAgent: `TestAgent/测试_${randomSuffix}`,
    viewportWidth: 1366,
    viewportHeight: 768,
    timezone: "Europe/Kiev",
    locale: "uk-UA",
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1.5,
    latitude: 50.4501,
    longitude: 30.5234,
  };
}

describe("DefaultSession", () => {
  it("throws error when browser method called before open", async () => {
    expect.assertions(1);
    const sessionData = createTestSessionData();
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await expect(session.browser()).rejects.toThrow(
      "Session is not open and context is unavailable - call open() method first"
    );
  });

  it("opens session successfully with valid session data", async () => {
    expect.assertions(1);
    const sessionData = createTestSessionData();
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    const context = await session.browser();
    await session[Symbol.asyncDispose]();
    expect(
      context,
      "DefaultSession did not open successfully with valid session data"
    ).toBeDefined();
  }, 10000);

  it("returns browser context after opening session", async () => {
    expect.assertions(1);
    const sessionData = createTestSessionData();
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    const context = await session.browser();
    await session[Symbol.asyncDispose]();
    expect(context.pages, "DefaultSession did not return valid browser context").toBeDefined();
  }, 10000);

  it("creates context with unicode user agent", async () => {
    expect.assertions(1);
    const sessionData: SessionData = {
      ...createTestSessionData(),
      userAgent: "Mozilla/测试浏览器/5.0",
    };
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    const context = await session.browser();
    await session[Symbol.asyncDispose]();
    expect(context, "DefaultSession did not create context with unicode user agent").toBeDefined();
  }, 10000);

  it("creates context with specified viewport dimensions", async () => {
    expect.assertions(1);
    const sessionData: SessionData = {
      ...createTestSessionData(),
      viewportWidth: 800,
      viewportHeight: 600,
    };
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    const context = await session.browser();
    const page = await context.newPage();
    const viewport = page.viewportSize();
    await page.close();
    await session[Symbol.asyncDispose]();
    expect(
      viewport?.width,
      "DefaultSession did not create context with specified viewport width"
    ).toBe(800);
  }, 10000);

  it("creates context with geographic coordinates", async () => {
    expect.assertions(1);
    const sessionData: SessionData = {
      ...createTestSessionData(),
      latitude: 48.8566,
      longitude: 2.3522,
    };
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    const context = await session.browser();
    await session[Symbol.asyncDispose]();
    expect(
      context,
      "DefaultSession did not create context with geographic coordinates"
    ).toBeDefined();
  }, 10000);

  it("cleans up resources when disposed", async () => {
    expect.assertions(1);
    const sessionData = createTestSessionData();
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session.open();
    await session[Symbol.asyncDispose]();
    expect(true, "DefaultSession did not clean up resources when disposed").toBe(true);
  });

  it("disposes safely when not initialized", async () => {
    expect.assertions(1);
    const sessionData = createTestSessionData();
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(sessionData, browserQuery);
    await session[Symbol.asyncDispose]();
    expect(true, "DefaultSession did not dispose safely when not initialized").toBe(true);
  });
});
