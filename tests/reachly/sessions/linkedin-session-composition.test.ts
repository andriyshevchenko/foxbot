import { describe, it, expect } from "vitest";
import { chromium } from "playwright";
import type { Browser } from "playwright";

import { Query } from "../../../foxbot/core";
import {
  AuthenticatedSession,
  DefaultSession,
  OptimizedSession,
  SessionData,
  StealthSession,
} from "../../../reachly/sessions";

/**
 * Mock browser instance for testing
 */
class MockBrowser implements Query<Browser> {
  async value(): Promise<Browser> {
    return await chromium.launch({ headless: true });
  }
}

/**
 * Creates test session data with random values for isolation.
 * Ensures each test uses unique data to prevent interference.
 */
function createSessionData(): SessionData {
  const randomId = Math.random().toString(36).substring(7);
  return {
    li_at: `test_li_at_${randomId}`,
    JSESSIONID: `test_session_${randomId}`,
    userAgent: `TestAgent/${randomId}`,
    viewportWidth: 1920,
    viewportHeight: 1080,
    timezone: "UTC",
    locale: "en-US",
  };
}

describe("LinkedIn Session Composition", () => {
  it("creates a basic session", () => {
    expect.assertions(1);
    const sessionData = createSessionData();
    const session = new DefaultSession(sessionData, new MockBrowser());
    expect(session, "Basic session creation failed").toBeInstanceOf(DefaultSession);
  });

  it("creates session with authentication", () => {
    expect.assertions(1);
    const sessionData = createSessionData();
    const session = new AuthenticatedSession(
      new DefaultSession(sessionData, new MockBrowser()),
      sessionData
    );
    expect(session, "Authenticated session creation failed").toBeInstanceOf(AuthenticatedSession);
  });

  it("creates session with optimization", () => {
    expect.assertions(1);
    const sessionData = createSessionData();
    const session = new OptimizedSession(new DefaultSession(sessionData, new MockBrowser()));
    expect(session, "Optimized session creation failed").toBeInstanceOf(OptimizedSession);
  });

  it("creates session with stealth", () => {
    expect.assertions(1);
    const sessionData = createSessionData();
    const session = new StealthSession(
      new DefaultSession(sessionData, new MockBrowser()),
      sessionData
    );
    expect(session, "Stealth session creation failed").toBeInstanceOf(StealthSession);
  });
});
