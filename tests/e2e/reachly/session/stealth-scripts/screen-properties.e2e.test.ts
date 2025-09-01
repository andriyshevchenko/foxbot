import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import { ScreenProperties } from "#reachly/session/stealth-scripts";
import { FakeViewport } from "#tests/fakes";

it("spoofs screen dimensions", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new ScreenProperties(new FakeViewport(10, 20, 5), new NumberLiteral(0));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => screen.availHeight);
  await browser.close();
  expect(value === 15, "ScreenProperties did not spoof dimensions").toBe(true);
});
