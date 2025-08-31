import { describe, expect, it } from "vitest";

import type { Query } from "#foxbot/core/query";
import { JsonDevice } from "#reachly/session/device";
import { JsonGraphics } from "#reachly/session/graphics";
import { JsonHost } from "#reachly/session/host";
import { JsonLocation } from "#reachly/session/location";
import { StealthSession } from "#reachly/session/stealth-session";
import { JsonViewport } from "#reachly/session/viewport";

import { FakeSession, TestSessionData } from "./index";

/**
 * Creates a stealth session for testing purposes.
 * Wraps a fake integration session with stealth configuration.
 *
 * @param q Query providing session data
 * @returns StealthSession configured with fake session and test data
 */
async function stealthSessionFrom(q: Query<string>): Promise<StealthSession> {
  const session = new FakeSession();
  return new StealthSession(
    session,
    new JsonViewport(q),
    new JsonGraphics(q),
    new JsonHost(q),
    new JsonDevice(q),
    new JsonLocation(q)
  );
}

describe("StealthSession", () => {
  it("injects stealth scripts when profiling session", async () => {
    expect.assertions(1);
    const stealthSession = await stealthSessionFrom(new TestSessionData(new Map()));
    const context = await stealthSession.profile();
    expect(
      context,
      "StealthSession did not inject stealth scripts when profiling session"
    ).toBeDefined();
  });

  it("handles session data with unicode locale", async () => {
    expect.assertions(1);
    const stealthSession = await stealthSessionFrom(
      new TestSessionData(new Map([["locale", "繁體中文-TW"]]))
    );
    const context = await stealthSession.profile();
    expect(context, "StealthSession did not handle session data with unicode locale").toBeDefined();
  });

  it("handles session data with unicode platform", async () => {
    expect.assertions(1);
    const stealthSession = await stealthSessionFrom(
      new TestSessionData(new Map([["platform", "Linux_测试平台"]]))
    );
    const context = await stealthSession.profile();
    expect(
      context,
      "StealthSession did not handle session data with unicode platform"
    ).toBeDefined();
  });

  it("handles minimal session data without optional properties", async () => {
    expect.assertions(1);
    const stealthSession = await stealthSessionFrom(
      new TestSessionData(
        new Map([
          ["li_at", "minimal_li_at"],
          ["JSESSIONID", "minimal_session"],
          ["userAgent", "MinimalAgent/1.0"],
          ["viewportWidth", "800"],
          ["viewportHeight", "600"],
          ["timezone", "UTC"],
          ["locale", "en-US"],
        ])
      )
    );
    const context = await stealthSession.profile();
    expect(
      context,
      "StealthSession did not handle minimal session data without optional properties"
    ).toBeDefined();
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const stealthSession = await stealthSessionFrom(new TestSessionData(new Map()));
    await expect(stealthSession.profile()).resolves.toBeDefined();
  });
});
