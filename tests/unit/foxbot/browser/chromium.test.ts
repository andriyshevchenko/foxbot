import { describe, expect, it, vi } from "vitest";
import { Chromium } from "#foxbot/browser/chromium";
import type { Query } from "#foxbot/core";

vi.mock("playwright", () => {
  class StubChromium {
    async launch(o: {
      headless: boolean;
      args: string[];
    }): Promise<{ headless: boolean; args: string[] }> {
      return o;
    }
  }
  return { chromium: new StubChromium() };
});

describe("Chromium", () => {
  it("launches browser with provided options", async () => {
    expect.assertions(1);
    class Flag implements Query<boolean> {
      async value(): Promise<boolean> {
        return false;
      }
    }
    const token = "ключ";
    class List implements Query<string> {
      async value(): Promise<string> {
        return token + ",½";
      }
    }
    const browser = await new Chromium(new Flag(), new List()).value();
    expect(browser, "Chromium did not forward launch options").toStrictEqual({
      headless: false,
      args: [token, "½"],
    });
  });
});
