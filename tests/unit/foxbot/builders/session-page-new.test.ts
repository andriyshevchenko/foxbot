import { describe, expect, it } from "vitest";
import { SessionPage } from "../../../../foxbot/builders/session_page";
import { FakeCoreSession } from "../../../fakes/fake-core-session";

describe("SessionPage", () => {
  it("creates page from session browser context", async () => {
    expect.assertions(1);
    const session = new FakeCoreSession();
    const sessionPage = new SessionPage(session);
    const page = await sessionPage.value();
    expect(page, "SessionPage did not create page from session browser context").toBeDefined();
  });
});
