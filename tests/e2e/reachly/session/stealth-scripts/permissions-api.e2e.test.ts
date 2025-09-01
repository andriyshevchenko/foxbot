import { chromium } from "playwright";
import { expect, it } from "vitest";

import { PermissionsApi } from "#reachly/session/stealth-scripts";

it("overrides navigator permissions query for notifications", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.evaluate("navigator.permissions.query = () => Promise.resolve({ state: 'denied' })");
  const script = new PermissionsApi();
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(async () => {
    const query = await navigator.permissions.query({ name: "notifications" });
    const permission = Notification.permission;
    return { state: query.state, permission };
  });
  await browser.close();
  expect(
    value.state === value.permission,
    "PermissionsApi did not return notification permission"
  ).toBe(true);
});
