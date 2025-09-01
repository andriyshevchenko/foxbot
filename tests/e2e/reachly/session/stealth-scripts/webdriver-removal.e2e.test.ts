import { chromium } from "playwright";
import { expect, it } from "vitest";

import { WebDriverRemoval } from "#reachly/session/stealth-scripts";

it("removes navigator webdriver property", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new WebDriverRemoval();
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => navigator.webdriver);
  await browser.close();
  expect(value === undefined, "WebDriverRemoval did not remove navigator webdriver").toBe(true);
});
