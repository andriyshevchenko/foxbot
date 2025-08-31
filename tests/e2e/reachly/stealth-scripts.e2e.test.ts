import { Chromium } from "#foxbot/browser";
import type { Query } from "#foxbot/core";
import { DefaultSession } from "#reachly/session/default-session";
import {
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  StealthSession,
} from "#reachly/session";
import { Headless, StealthArgs } from "#reachly/browser";
import type { Browser } from "playwright";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

class ExistingBrowser implements Query<Browser> {
  constructor(private readonly browser: Browser) {}
  async value(): Promise<Browser> {
    return this.browser;
  }
}

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

describe("stealth scripts e2e", () => {
  let browser: Browser;
  beforeAll(async () => {
    process.env.HEADLESS = "true";
    browser = await new Chromium(new Headless(), new StealthArgs()).value();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("applies stealth modifications in real browser", async () => {
    expect.assertions(6);
    const sessionData = new FakeSessionData();
    const base = new DefaultSession(
      new JsonViewport(sessionData),
      new JsonHost(sessionData),
      new JsonLocation(sessionData),
      new ExistingBrowser(browser)
    );
    const session = new StealthSession(
      base,
      new JsonViewport(sessionData),
      new JsonGraphics(sessionData),
      new JsonHost(sessionData),
      new JsonDevice(sessionData),
      new JsonLocation(sessionData)
    );
    const context = await session.profile();
    const page = await context.newPage();
    await page.goto("about:blank");

    await expect(page.evaluate(() => navigator.webdriver)).resolves.toBeUndefined();
    await expect(page.evaluate(() => navigator.languages)).resolves.toEqual(["en-US", "en"]);
    await expect(page.evaluate(() => navigator.plugins.length)).resolves.toBe(1);
    await expect(page.evaluate(() => [screen.width, screen.availHeight])).resolves.toEqual([
      1920, 1040,
    ]);
    await expect(
      page.evaluate(() => {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        if (!gl) return [];
        return [gl.getParameter(gl.VENDOR), gl.getParameter(gl.RENDERER)];
      })
    ).resolves.toHaveLength(2);
    const elapsed = await page.evaluate(async () => {
      const start = Date.now();
      await fetch("data:text/plain,hi");
      return Date.now() - start;
    });
    expect(elapsed).toBeGreaterThanOrEqual(5);

    await context.close();
  }, 60000);
});
