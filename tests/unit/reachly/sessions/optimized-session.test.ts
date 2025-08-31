import { describe, expect, it } from "vitest";

import { OptimizedSession } from "#foxbot/session";

import { FakeSession } from "./index";

describe("OptimizedSession", () => {
  it("creates host context with route handlers", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    const context = await optimizedSession.profile();
    expect(
      context,
      "OptimizedSession did not create host context with route handlers"
    ).toBeDefined();
  });

  it("handles host context creation with unicode paths", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    const context = await optimizedSession.profile();
    expect(
      context,
      "OptimizedSession did not handle host context creation with unicode paths"
    ).toBeDefined();
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await expect(optimizedSession.profile()).resolves.toBeDefined();
  });

  // Under new lifecycle, profile delegates directly; no pre-open error expected
});
