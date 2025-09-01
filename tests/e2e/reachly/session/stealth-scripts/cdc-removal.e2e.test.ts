import { chromium } from "playwright";
import { expect, it } from "vitest";

import { CdcRemoval } from "#reachly/session/stealth-scripts";

it("removes cdc markers from window", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.evaluate("window.cdc_adoQpoasnfa76pfcZLmcfl_Array = []");
  const script = new CdcRemoval();
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate("'cdc_adoQpoasnfa76pfcZLmcfl_Array' in window");
  await browser.close();
  expect(value === false, "CdcRemoval did not remove array marker").toBe(true);
});
