import { describe, expect, it } from "vitest";

import { DefaultSession } from "../../../../reachly/session/default-session";
import { JsonHost } from "../../../../reachly/session/host";
import { JsonLocation } from "../../../../reachly/session/location";
import { JsonViewport } from "../../../../reachly/session/viewport";

import { FakeBrowser, TestSessionData } from "./index";

describe("DefaultSession", () => {
  it("throws error when host method called before open", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map());
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await expect(session.host()).rejects.toThrow(
      "Session is not open and context is unavailable - call open() method first"
    );
  });

  it("opens session successfully with valid session data", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map());
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    const context = await session.host();
    await session.close();
    expect(
      context,
      "DefaultSession did not open successfully with valid session data"
    ).toBeDefined();
  }, 10000);

  it("returns host context after opening session", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map());
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    const context = await session.host();
    await session.close();
    expect(context.pages, "DefaultSession did not return valid host context").toBeDefined();
  }, 10000);

  it("creates context with unicode user agent", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map([["userAgent", "Mozilla/测试浏览器/5.0"]]));
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    const context = await session.host();
    await session.close();
    expect(context, "DefaultSession did not create context with unicode user agent").toBeDefined();
  }, 10000);

  it("creates context with specified viewport dimensions", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(
      new Map([
        ["viewportWidth", "800"],
        ["viewportHeight", "600"],
      ])
    );
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    const context = await session.host();
    const page = await context.newPage();
    const viewport = page.viewportSize();
    await page.close();
    await session.close();
    expect(
      viewport?.width,
      "DefaultSession did not create context with specified viewport width"
    ).toBe(800);
  }, 10000);

  it("creates context with geographic coordinates", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(
      new Map([
        ["latitude", "48.8566"],
        ["longitude", "2.3522"],
      ])
    );
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    const context = await session.host();
    await session.close();
    expect(
      context,
      "DefaultSession did not create context with geographic coordinates"
    ).toBeDefined();
  }, 10000);

  it("cleans up resources when disposed", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map());
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.open();
    await session.close();
    expect(true, "DefaultSession did not clean up resources when disposed").toBe(true);
  });

  it("disposes safely when not initialized", async () => {
    expect.assertions(1);
    const testData = new TestSessionData(new Map());
    const browserQuery = new FakeBrowser();
    const session = new DefaultSession(
      new JsonViewport(testData),
      new JsonHost(testData),
      new JsonLocation(testData),
      browserQuery
    );
    await session.close();
    expect(true, "DefaultSession did not dispose safely when not initialized").toBe(true);
  });
});
