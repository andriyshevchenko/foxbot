import { describe, expect, it } from "vitest";

import { TextLiteral } from "../../../../foxbot/value";
import {
  AuthenticatedSession,
  DefaultSession,
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  OptimizedSession,
  StealthSession,
} from "../../../../reachly/session";

import { FakeBrowser } from "./index";

/**
 * Creates test session data JSON string with random values for isolation.
 * Ensures each test uses unique data to prevent interference.
 *
 * @returns JSON string containing randomized session data
 */
function createSessionDataJson(): string {
  const randomId = Math.random().toString(36).substring(7);
  return JSON.stringify({
    li_at: `test_li_at_${randomId}`,
    JSESSIONID: `test_session_${randomId}`,
    userAgent: `TestAgent/${randomId}`,
    viewportWidth: 1920,
    viewportHeight: 1080,
    timezone: "UTC",
    locale: "en-US",
    screenWidth: 1920,
    screenHeight: 1080,
    latitude: 40.7128,
    longitude: -74.006,
    webglVendor: "Google Inc.",
    webglRenderer: "ANGLE (Intel(R) HD Graphics 630)",
    platform: "Win32",
    deviceMemory: 8,
    hardwareConcurrency: 4,
  });
}

describe("LinkedIn Session Composition", () => {
  it("creates a basic session", () => {
    expect.assertions(1);
    const sessionJson = createSessionDataJson();
    const sessionData = new TextLiteral(sessionJson);
    const session = new DefaultSession(
      new JsonViewport(sessionData),
      new JsonHost(sessionData),
      new JsonLocation(sessionData),
      new FakeBrowser()
    );
    expect(session, "Basic session creation failed").toBeInstanceOf(DefaultSession);
  });

  it("creates session with authentication", () => {
    expect.assertions(1);
    const sessionJson = createSessionDataJson();
    const sessionData = new TextLiteral(sessionJson);
    const session = new AuthenticatedSession(
      new DefaultSession(
        new JsonViewport(sessionData),
        new JsonHost(sessionData),
        new JsonLocation(sessionData),
        new FakeBrowser()
      ),
      new JsonHost(sessionData)
    );
    expect(session, "Authenticated session creation failed").toBeInstanceOf(AuthenticatedSession);
  });

  it("creates optimized session", () => {
    expect.assertions(1);
    const sessionJson = createSessionDataJson();
    const sessionData = new TextLiteral(sessionJson);
    const session = new OptimizedSession(
      new DefaultSession(
        new JsonViewport(sessionData),
        new JsonHost(sessionData),
        new JsonLocation(sessionData),
        new FakeBrowser()
      )
    );
    expect(session, "Optimized session creation failed").toBeInstanceOf(OptimizedSession);
  });

  it("creates stealth session", () => {
    expect.assertions(1);
    const sessionJson = createSessionDataJson();
    const sessionData = new TextLiteral(sessionJson);
    const session = new StealthSession(
      new DefaultSession(
        new JsonViewport(sessionData),
        new JsonHost(sessionData),
        new JsonLocation(sessionData),
        new FakeBrowser()
      ),
      new JsonViewport(sessionData),
      new JsonGraphics(sessionData),
      new JsonHost(sessionData),
      new JsonDevice(sessionData),
      new JsonLocation(sessionData)
    );
    expect(session, "Stealth session creation failed").toBeInstanceOf(StealthSession);
  });
});
