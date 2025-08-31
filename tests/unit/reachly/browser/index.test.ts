import { describe, expect, it } from "vitest";

import { Headless, StealthArgs } from "#reachly/browser";

describe("browser index", () => {
  it("exports headless query through index", () => {
    expect.assertions(1);
    expect(typeof Headless, "Browser index failed to export Headless").toBe("function");
  });
  it("exports stealth args query through index", () => {
    expect.assertions(1);
    expect(typeof StealthArgs, "Browser index failed to export StealthArgs").toBe("function");
  });
});
