import { describe, expect, it } from "vitest";

import { SinglePage } from "../../../../reachly/sessions/single-page";

import { FakeIntegrationSession } from "./index";

describe("SinglePage", () => {
  it("creates a page in host context", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    await fakeSession.open();
    const singlePageSession = new SinglePage(fakeSession);
    await singlePageSession.open();
    const context = await singlePageSession.host();
    expect(context.pages().length, "SinglePage did not create a page in host context").toBe(1);
    await singlePageSession.close();
  });
});
