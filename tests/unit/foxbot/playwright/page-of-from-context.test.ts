import { describe, expect, it } from "vitest";
import { PageOf } from "#foxbot/page/page_of";
import { FakeCoreSession } from "#tests/fakes/fake-core-session";

describe("PageOf", () => {
  it("returns page from session host context", async () => {
    expect.assertions(1);
    const session = new FakeCoreSession();
    const sessionPage = new PageOf(session);
    const page = await sessionPage.value();
    expect(page, "PageOf did not return page from session host context").toBeDefined();
  });
});
