import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import { NavigatorPlugins } from "#reachly/session/stealth-scripts";

it("spoofs navigator plugins array", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new NavigatorPlugins(new NumberLiteral(1));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => navigator.plugins.length);
  await browser.close();
  expect(value === 1, "NavigatorPlugins did not spoof plugins array").toBe(true);
});
