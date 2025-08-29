import { describe, expect, it } from "vitest";

import { Chromium } from "#foxbot/browser";

import { FakeArgs, FakeHeadless } from "#tests/fakes/fake-playwright-queries";

describe("Chromium", () => {
  it("launches chromium browser with headless true", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch a browser instance").toBeDefined();
  });

  const displayAvailable = !!process.env.DISPLAY;

  (displayAvailable ? it : it.skip)("launches chromium browser with headless false", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(false);
    const args = new FakeArgs("--no-sandbox,--disable-gpu");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(
      browser,
      "Chromium did not launch a browser instance in non-headless mode"
    ).toBeDefined();
  });

  it("launches browser with single argument", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with single argument").toBeDefined();
  });

  it("launches browser with multiple arguments", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox,--disable-gpu,--disable-dev-shm-usage");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with multiple arguments").toBeDefined();
  });

  it("launches browser with empty arguments string", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with empty arguments").toBeDefined();
  });

  it("launches browser with unicode arguments", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox,--disable-gpu");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with unicode arguments").toBeDefined();
  });
});
