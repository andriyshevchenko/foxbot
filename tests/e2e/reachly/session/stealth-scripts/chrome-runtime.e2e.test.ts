import { chromium } from "playwright";
import { expect, it } from "vitest";

import { ChromeRuntime } from "#reachly/session/stealth-scripts";

it("defines chrome runtime object", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new ChromeRuntime();
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate("typeof window.chrome.runtime");
  await browser.close();
  expect(value === "object", "ChromeRuntime did not define runtime object").toBe(true);
});
