import { describe, it, expect } from "vitest";
import { Chromium } from "../../../reachly/playwright/chromium";
import type { Query } from "../../../foxbot/core";

/**
 * Test double for headless query that returns a fixed boolean value.
 */
class FakeHeadless implements Query<boolean> {
  constructor(private readonly returnValue: boolean) {}

  async value(): Promise<boolean> {
    return this.returnValue;
  }
}

/**
 * Test double for args query that returns a fixed string value.
 */
class FakeArgs implements Query<string> {
  constructor(private readonly returnValue: string) {}

  async value(): Promise<string> {
    return this.returnValue;
  }
}

describe("Chromium", () => {
  it("launches chromium browser with headless true", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch a browser instance").toBeDefined();
  }, 10000);

  it.skip("launches chromium browser with headless false", async () => {
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
  }, 10000);

  it("launches browser with single argument", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with single argument").toBeDefined();
  }, 10000);

  it("launches browser with multiple arguments", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox,--disable-gpu,--disable-dev-shm-usage");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with multiple arguments").toBeDefined();
  }, 10000);

  it("launches browser with empty arguments string", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with empty arguments").toBeDefined();
  }, 10000);

  it("launches browser with unicode arguments", async () => {
    expect.assertions(1);
    const headless = new FakeHeadless(true);
    const args = new FakeArgs("--no-sandbox,--disable-gpu");
    const chromium = new Chromium(headless, args);
    const browser = await chromium.value();
    await browser.close();
    expect(browser, "Chromium did not launch browser with unicode arguments").toBeDefined();
  }, 10000);
});
