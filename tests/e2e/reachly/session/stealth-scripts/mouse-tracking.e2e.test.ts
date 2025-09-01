import { chromium } from "playwright";
import { expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import { MouseTracking } from "#reachly/session/stealth-scripts";

it("records mouse events", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 100, height: 100 });
  const script = new MouseTracking(new NumberLiteral(10));
  const code = await script.value();
  await page.evaluate(code + " window.mouseEvents = mouseEvents;");
  await page.mouse.move(10, 10);
  const value = await page.evaluate("window.mouseEvents.length");
  await browser.close();
  expect(typeof value === "number" && value > 0, "MouseTracking did not record mouse events").toBe(
    true
  );
});
