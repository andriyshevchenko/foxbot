import { chromium } from "playwright";
import { describe, expect, it } from "vitest";

import { WebDriverRemoval } from "#reachly/session/stealth-scripts";

describe("WebDriverRemoval", () => {
  it("removes webdriver from the navigator in the browser", async () => {
    expect.assertions(1);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const script = await new WebDriverRemoval().value();
    await page.addInitScript(script);
    await page.goto("about:blank");
    const result = await page.evaluate("navigator.webdriver === undefined");
    await browser.close();
    expect(result, "WebDriverRemoval did not remove webdriver").toBe(true);
  }, 30000);
});
