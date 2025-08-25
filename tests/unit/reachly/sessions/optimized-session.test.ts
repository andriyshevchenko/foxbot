import { describe, expect, it } from "vitest";

import { OptimizedSession } from "../../../../reachly/sessions/optimized-session";

import { FakeIntegrationSession } from "./index";

describe("OptimizedSession", () => {
  it("creates browser context with route handlers", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession.close();
    expect(
      context,
      "OptimizedSession did not create browser context with route handlers"
    ).toBeDefined();
  });

  it("handles browser context creation with unicode paths", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await optimizedSession.open();
    const context = await optimizedSession.browser();
    await optimizedSession.close();
    expect(
      context,
      "OptimizedSession did not handle browser context creation with unicode paths"
    ).toBeDefined();
  });

  it("opens session without throwing errors", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await expect(optimizedSession.open()).resolves.not.toThrow();
  });

  it("throws error when browser called before open", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const optimizedSession = new OptimizedSession(fakeSession);
    await expect(optimizedSession.browser()).rejects.toThrow("Session not open");
  });
});
