import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import { BoundingRectJitter } from "#reachly/session/stealth-scripts";

it("jitters element bounding rectangle", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.evaluate(() => {
    const div = document.createElement("div");
    div.id = "t";
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    document.body.appendChild(div);
  });
  const script = new BoundingRectJitter(new NumberLiteral(1), new NumberLiteral(0.5));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => {
    Math.random = () => 0;
    const rect = document.getElementById("t")!.getBoundingClientRect();
    return rect.x;
  });
  await browser.close();
  expect(value === -0.5, "BoundingRectJitter did not jitter x coordinate").toBe(true);
});
