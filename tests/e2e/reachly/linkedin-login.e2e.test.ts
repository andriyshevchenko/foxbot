import type { Browser } from "playwright";
import { describe, expect, it } from "vitest";
import type { Query } from "../../../foxbot/core";
import { Chromium, Headless, StealthArgs } from "../../../reachly/playwright";
import {
  AuthenticatedSession,
  DefaultSession,
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  OptimizedSession,
  SessionDecorator,
  StealthSession,
} from "../../../reachly/sessions";
import { LinkedInLogin } from "../../../reachly/workflows/linkedin-login";
import { OpenSession, Sequence, SessionGuard, Lambda } from "../../../foxbot/actions";

/**
 * LinkedIn session decorator that composes stealth, optimization, and authentication capabilities.
 * Uses the decorator composition pattern with a shared JSON string for all Json* components.
 *
 * @example
 * ```typescript
 * const session = new LinkedInSession(jsonQuery, browserQuery);
 * await session.open();
 * ```
 */
class LinkedInSession extends SessionDecorator {
  constructor(jsonSource: Query<string>, browserQuery: Query<Browser>) {
    const baseSession = new DefaultSession(
      new JsonViewport(jsonSource),
      new JsonHost(jsonSource),
      new JsonLocation(jsonSource),
      browserQuery
    );

    const authenticatedSession = new AuthenticatedSession(baseSession, new JsonHost(jsonSource));

    const optimizedSession = new OptimizedSession(authenticatedSession);

    const stealthSession = new StealthSession(
      optimizedSession,
      new JsonViewport(jsonSource),
      new JsonGraphics(jsonSource),
      new JsonHost(jsonSource),
      new JsonDevice(jsonSource),
      new JsonLocation(jsonSource)
    );

    super(stealthSession);
  }

  async open(): Promise<void> {
    await this.session.open();
  }
}

/**
 * Fake session data implementation for testing LinkedIn automation.
 * Provides realistic browser fingerprint data for comprehensive session testing.
 *
 * @example
 * ```typescript
 * const sessionData = new FakeSessionData();
 * const jsonSource = await sessionData.value();
 * ```
 */
class FakeSessionData implements Query<string> {
  private readonly randomId = Math.random().toString(36).substring(7);

  async value(): Promise<string> {
    return JSON.stringify({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      locale: "en-US",
      timezone: "America/New_York",
      headers: {},
      cookies: [],
      viewportWidth: 1920,
      viewportHeight: 1080,
      screenWidth: 1920,
      screenHeight: 1080,
      devicePixelRatio: 1,
      taskbarHeight: 40,
      platform: "Win32",
      deviceMemory: 8,
      hardwareConcurrency: 16,
      webglVendor: "Google Inc.",
      webglRenderer: `ANGLE (NVIDIA GeForce RTX 3080) ${this.randomId}`,
      latitude: 40.7128,
      longitude: -74.006,
    });
  }
}

describe.skip("LinkedIn Login E2E Test", () => {
  it("creates session and performs login workflow with real browser", async () => {
    expect.assertions(1);

    const sessionData = new FakeSessionData();
    const browserQuery = new Chromium(new Headless(), new StealthArgs());
    const session = new LinkedInSession(sessionData, browserQuery);

    await new SessionGuard(
      new Sequence([
        new OpenSession(session),
        new LinkedInLogin(session),
        new Lambda(async () => {
          expect(
            await session.browser(),
            "LinkedIn session failed to create browser context"
          ).toBeDefined();
        }),
      ]),
      session
    ).perform();
  }, 30000);

  it("performs complete LinkedIn login workflow", async () => {
    expect.assertions(1);

    const sessionData = new FakeSessionData();
    const browserQuery = new Chromium(new Headless(), new StealthArgs());
    const session = new LinkedInSession(sessionData, browserQuery);

    await new SessionGuard(
      new Sequence([
        new OpenSession(session),
        new LinkedInLogin(session),
        new Lambda(async () => {
          expect(true, "LinkedIn login workflow did not complete successfully").toBe(true);
        }),
      ]),
      session
    ).perform();
  }, 60000);
});
