import { describe, expect, it } from "vitest";

import { AuthenticatedSession } from "../../../../reachly/sessions/authenticated-session";
import { JsonHost } from "../../../../reachly/sessions/host";

import { AuthenticatedTestSessionData, FakeIntegrationSession } from "./index";

describe("AuthenticatedSession", () => {
  it("adds LinkedIn cookies to host context", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const authenticatedSession = new AuthenticatedSession(
      fakeSession,
      new JsonHost(new AuthenticatedTestSessionData(new Map()))
    );
    await fakeSession.open();
    await authenticatedSession.open();
    const context = await authenticatedSession.host();
    const cookies = await context.cookies();
    await authenticatedSession.close();
    const hasLinkedInCookies = cookies.some(
      (cookie) => cookie.name === "li_at" || cookie.name === "JSESSIONID"
    );
    expect(
      hasLinkedInCookies,
      "AuthenticatedSession did not add LinkedIn cookies to host context"
    ).toBe(true);
  });

  it("adds additional cookies from session data", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const authenticatedSession = new AuthenticatedSession(
      fakeSession,
      new JsonHost(new AuthenticatedTestSessionData(new Map()))
    );
    await fakeSession.open();
    await authenticatedSession.open();
    const context = await authenticatedSession.host();
    const cookies = await context.cookies();
    await authenticatedSession.close();
    const hasAdditionalCookies = cookies.some((cookie) => cookie.name === "追加_cookie");
    expect(
      hasAdditionalCookies,
      "AuthenticatedSession did not add additional cookies from session data"
    ).toBe(true);
  });

  it("sets secure flag on LinkedIn cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();

    const authenticatedSession = new AuthenticatedSession(
      fakeSession,
      new JsonHost(new AuthenticatedTestSessionData(new Map()))
    );
    await fakeSession.open();
    await authenticatedSession.open();
    const context = await authenticatedSession.host();
    const cookies = await context.cookies();
    await authenticatedSession.close();
    const linkedInCookie = cookies.find((cookie) => cookie.name === "li_at");
    expect(
      linkedInCookie?.secure,
      "AuthenticatedSession did not set secure flag on LinkedIn cookies"
    ).toBe(true);
  });

  it("sets httpOnly flag on LinkedIn cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();

    const authenticatedSession = new AuthenticatedSession(
      fakeSession,
      new JsonHost(new AuthenticatedTestSessionData(new Map()))
    );
    await fakeSession.open();
    await authenticatedSession.open();
    const context = await authenticatedSession.host();
    const cookies = await context.cookies();
    await authenticatedSession.close();
    const jsessionCookie = cookies.find((cookie) => cookie.name === "JSESSIONID");
    expect(
      jsessionCookie?.httpOnly,
      "AuthenticatedSession did not set httpOnly flag on LinkedIn cookies"
    ).toBe(true);
  });

  it("handles session data without additional cookies", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();

    const authenticatedSession = new AuthenticatedSession(
      fakeSession,
      new JsonHost(new AuthenticatedTestSessionData(new Map()))
    );
    await fakeSession.open();
    await authenticatedSession.open();
    const context = await authenticatedSession.host();
    await authenticatedSession.close();
    expect(
      context,
      "AuthenticatedSession did not handle session data without additional cookies"
    ).toBeDefined();
  });
});
