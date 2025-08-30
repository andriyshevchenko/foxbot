import { describe, expect, it } from "vitest";

import { SinglePage } from "#reachly/session/single-page";

import { FakeSession } from "./index";

describe("SinglePage", () => {
  it("creates a page in host context", async () => {
    expect.assertions(1);
    const fakeSession = new FakeSession();
    const singlePageSession = new SinglePage(fakeSession);
    const context = await singlePageSession.profile();
    expect(context.pages().length, "SinglePage did not create a page in host context").toBe(1);
  });
});
