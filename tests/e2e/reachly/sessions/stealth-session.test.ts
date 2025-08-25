import { describe, expect, it } from "vitest";

import type { Query } from "../../../../foxbot/core/query";
import { JsonDevice } from "../../../../reachly/sessions/device";
import { JsonGraphics } from "../../../../reachly/sessions/graphics";
import { JsonHost } from "../../../../reachly/sessions/host";
import { JsonLocation } from "../../../../reachly/sessions/location";
import { StealthSession } from "../../../../reachly/sessions/stealth-session";
import { JsonViewport } from "../../../../reachly/sessions/viewport";

import { FakeIntegrationSession, TestSessionData } from "./index";

/**
 * Creates a stealth session for testing purposes.
 * Wraps a fake integration session with stealth configuration.
 *
 * @param q Query providing session data
 * @returns StealthSession configured with fake session and test data
 */
function stealthSessionFrom(q: Query<string>): StealthSession {
  return new StealthSession(
    new FakeIntegrationSession(),
    new JsonViewport(q),
    new JsonGraphics(q),
    new JsonHost(q),
    new JsonDevice(q),
    new JsonLocation(q)
  );
}

describe("StealthSession", () => {
  it("injects stealth scripts after opening session", async () => {
    expect.assertions(1);
    const stealthSession = stealthSessionFrom(new TestSessionData(new Map()));
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession.close();
    expect(
      context,
      "StealthSession did not inject stealth scripts after opening session"
    ).toBeDefined();
  });

  it("handles session data with unicode locale", async () => {
    expect.assertions(1);
    const stealthSession = stealthSessionFrom(
      new TestSessionData(new Map([["locale", "繁體中文-TW"]]))
    );
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession.close();
    expect(context, "StealthSession did not handle session data with unicode locale").toBeDefined();
  });

  it("handles session data with unicode platform", async () => {
    expect.assertions(1);
    const stealthSession = stealthSessionFrom(
      new TestSessionData(new Map([["platform", "Linux_测试平台"]]))
    );
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession.close();
    expect(
      context,
      "StealthSession did not handle session data with unicode platform"
    ).toBeDefined();
  });

  it("handles minimal session data without optional properties", async () => {
    expect.assertions(1);
    const stealthSession = stealthSessionFrom(
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
    await stealthSession.open();
    const context = await stealthSession.browser();
    await stealthSession.close();
    expect(
      context,
      "StealthSession did not handle minimal session data without optional properties"
    ).toBeDefined();
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const stealthSession = stealthSessionFrom(new TestSessionData(new Map()));
    await expect(stealthSession.open()).resolves.not.toThrow();
  });
});
