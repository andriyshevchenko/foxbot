import { describe, expect, it, vi } from "vitest";
import type { Query } from "#foxbot/core";

class StubChromium {
  async launch(o: {
    headless: boolean;
    args: string[];
  }): Promise<{ headless: boolean; args: string[] }> {
    return o;
  }
}
vi.mock("playwright", () => ({ chromium: new StubChromium() }));

describe("Chromium", () => {
  it("launches browser with provided options", async () => {
    expect.assertions(1);
    const { Chromium } = await import("#foxbot/browser/chromium");
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
