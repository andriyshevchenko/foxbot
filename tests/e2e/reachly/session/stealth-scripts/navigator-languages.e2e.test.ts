import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NavigatorLanguages } from "#reachly/session/stealth-scripts";
import { FakeHost } from "#tests/fakes";

it("spoofs navigator languages array", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new NavigatorLanguages(new FakeHost("fr-CA"));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => navigator.languages[0]);
  await browser.close();
  expect(value === "fr-CA", "NavigatorLanguages did not spoof languages array").toBe(true);
});
