import { describe, expect, it } from "vitest";

import { LinkedInLogin } from "#reachly/linkedin/login";
import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";

describe("LinkedInLogin", () => {
  it("creates login workflow with perform function", () => {
    expect.assertions(1);
    class Stub implements Session {
      async profile(): Promise<BrowserContext> {
        throw new Error("profile unreachable");
      }
    }
    const login = new LinkedInLogin(new Stub());
    expect(typeof login.perform, "LinkedInLogin failed to create perform function").toBe(
      "function"
    );
  });
});
