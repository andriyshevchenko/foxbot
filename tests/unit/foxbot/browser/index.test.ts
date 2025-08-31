import { describe, expect, it } from "vitest";

import { Chromium } from "#foxbot/browser";

describe("browser index", () => {
  it("exports Chromium query through index", () => {
    expect.assertions(1);
    expect(typeof Chromium, "Browser index failed to export Chromium").toBe("function");
  });
});
