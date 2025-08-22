import { describe, it, expect } from "vitest";
import { StealthArgs } from "../../../reachly/playwright/stealth-args";

describe("StealthArgs", () => {
  it("returns default chrome arguments as comma separated string", async () => {
    expect.assertions(1);
    const stealthArgs = new StealthArgs();
    const result = await stealthArgs.value();
    expect(result, "StealthArgs did not return a comma-separated string").toContain("--no-sandbox");
  });

  it("includes all required stealth arguments", async () => {
    expect.assertions(1);
    const stealthArgs = new StealthArgs();
    const result = await stealthArgs.value();
    const requiredArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ];
    const hasAllArgs = requiredArgs.every((arg) => result.includes(arg));
    expect(hasAllArgs, "StealthArgs did not include all required stealth arguments").toBe(true);
  });

  it("returns arguments separated by commas", async () => {
    expect.assertions(1);
    const stealthArgs = new StealthArgs();
    const result = await stealthArgs.value();
    const commaCount = (result.match(/,/g) || []).length;
    expect(commaCount, "StealthArgs did not return comma-separated arguments").toBeGreaterThan(10);
  });

  it("does not include empty arguments", async () => {
    expect.assertions(1);
    const stealthArgs = new StealthArgs();
    const result = await stealthArgs.value();
    const argArray = result.split(",");
    const hasEmptyArgs = argArray.some((arg) => arg.trim() === "");
    expect(hasEmptyArgs, "StealthArgs included empty arguments").toBe(false);
  });

  it("returns consistent results across multiple calls", async () => {
    expect.assertions(1);
    const stealthArgs = new StealthArgs();
    const firstResult = await stealthArgs.value();
    const secondResult = await stealthArgs.value();
    expect(firstResult, "StealthArgs did not return consistent results across calls").toBe(
      secondResult
    );
  });
});
