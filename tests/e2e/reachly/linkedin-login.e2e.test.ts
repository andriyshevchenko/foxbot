import { describe, expect, it } from "vitest";
import type { Browser } from "playwright";

import { Chromium } from "#foxbot/browser";
import { Lambda, Sequence } from "#foxbot/control";
import { NumberLiteral } from "#foxbot/core";
import { CachedSession, OptimizedSession, Session, SessionGuard } from "#foxbot/session";
import { Headless, StealthArgs } from "#reachly/browser";
import { LinkedInLogin } from "#reachly/linkedin";
import {
  AuthenticatedSession,
  DefaultSession,
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  SinglePage,
  StealthSession,
} from "#reachly/session";
import {
  BoundingRectJitter,
  CdcRemoval,
  ChromeRuntime,
  DeviceProperties,
  FetchTiming,
  MouseTracking,
  NavigatorLanguages,
  NavigatorPlugins,
  PermissionsApi,
  ScreenProperties,
  WebDriverRemoval,
  WebGLContext,
} from "#reachly/session/stealth-scripts";

import type { Query } from "#foxbot/core";

/**
 * LinkedIn session decorator that composes stealth, optimization, and authentication capabilities.
 * Uses the decorator composition pattern with a shared JSON string for all Json* components.
 *
 * @example
 * ```typescript
 * const session = new LinkedInSession(jsonQuery, browserQuery);
 * const context = await session.profile();
 * ```
 */
class LinkedInSession implements Session {
  private readonly chain: Session;
  constructor(jsonSource: Query<string>, browserQuery: Query<Browser>) {
    this.chain = new CachedSession(
      new SinglePage(
        new StealthSession(
          new OptimizedSession(
            new AuthenticatedSession(
              new DefaultSession(
                new JsonViewport(jsonSource),
                new JsonHost(jsonSource),
                new JsonLocation(jsonSource),
                browserQuery
              ),
              new JsonHost(jsonSource)
            )
          ),
          [
            new WebDriverRemoval(),
            new CdcRemoval(),
            new ChromeRuntime(),
            new PermissionsApi(),
            new NavigatorPlugins(new NumberLiteral(1)),
            new NavigatorLanguages(new JsonHost(jsonSource)),
            new DeviceProperties(new JsonDevice(jsonSource)),
            new ScreenProperties(new JsonViewport(jsonSource), new NumberLiteral(40)),
            new WebGLContext(new JsonGraphics(jsonSource)),
            new MouseTracking(new NumberLiteral(50)),
            new BoundingRectJitter(new NumberLiteral(0.1), new NumberLiteral(0.5)),
            new FetchTiming(new NumberLiteral(5), new NumberLiteral(15)),
          ]
        )
      )
    );
  }
  async profile() {
    return this.chain.profile();
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
        new LinkedInLogin(session),
        new Lambda(async () => {
          expect(
            await session.profile(),
            "LinkedIn session failed to create host context"
          ).toBeDefined();
        }),
      ]),
      session
    ).perform();
  }, 300000);
});
