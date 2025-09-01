import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import { FetchTiming } from "#reachly/session/stealth-scripts";

it("delays fetch requests", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new FetchTiming(new NumberLiteral(10), new NumberLiteral(10));
  const code = await script.value();
  const value = await page.evaluate(async (c: string) => {
    eval(c);
    const start = performance.now();
    await fetch("data:");
    return performance.now() - start;
  }, code);
  await browser.close();
  expect(value >= 10, "FetchTiming did not delay fetch").toBe(true);
});
