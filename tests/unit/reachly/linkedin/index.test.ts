import { describe, expect, it } from "vitest";

import { LinkedInLogin } from "#reachly/linkedin";

describe("linkedin index", () => {
  it("exports login workflow through index", () => {
    expect.assertions(1);
    expect(typeof LinkedInLogin, "LinkedIn index failed to export LinkedInLogin").toBe("function");
  });
});
