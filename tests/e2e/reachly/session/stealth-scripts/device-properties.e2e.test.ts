import { chromium } from "playwright";
import { expect, it } from "vitest";

import { DeviceProperties } from "#reachly/session/stealth-scripts";
import { FakeDevice } from "#tests/fakes";

it("spoofs navigator device properties", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new DeviceProperties(new FakeDevice("linux", 2, 4));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => navigator.platform);
  await browser.close();
  expect(value === "linux", "DeviceProperties did not spoof platform").toBe(true);
});
