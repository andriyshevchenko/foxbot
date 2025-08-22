import { describe, it, expect } from "vitest";
import { Headless } from "../../../reachly/playwright/headless";

describe("Headless", () => {
  it("returns true when HEADLESS environment variable is true", async () => {
    expect.assertions(1);
    process.env["HEADLESS"] = "true";
    const headless = new Headless();
    const result = await headless.value();
    delete process.env["HEADLESS"];
    expect(result, "Headless did not return true when HEADLESS environment variable was true").toBe(
      true
    );
  });

  it("returns false when HEADLESS environment variable is false", async () => {
    expect.assertions(1);
    process.env["HEADLESS"] = "false";
    const headless = new Headless();
    const result = await headless.value();
    delete process.env["HEADLESS"];
    expect(
      result,
      "Headless did not return false when HEADLESS environment variable was false"
    ).toBe(false);
  });

  it("returns false when HEADLESS environment variable is undefined", async () => {
    expect.assertions(1);
    delete process.env["HEADLESS"];
    const headless = new Headless();
    const result = await headless.value();
    expect(
      result,
      "Headless did not return false when HEADLESS environment variable was undefined"
    ).toBe(false);
  });

  it("returns false when HEADLESS environment variable contains unicode characters", async () => {
    expect.assertions(1);
    process.env["HEADLESS"] = "真実";
    const headless = new Headless();
    const result = await headless.value();
    delete process.env["HEADLESS"];
    expect(
      result,
      "Headless did not return false when HEADLESS environment variable contained unicode characters"
    ).toBe(false);
  });

  it("returns false when HEADLESS environment variable is empty string", async () => {
    expect.assertions(1);
    process.env["HEADLESS"] = "";
    const headless = new Headless();
    const result = await headless.value();
    delete process.env["HEADLESS"];
    expect(
      result,
      "Headless did not return false when HEADLESS environment variable was empty string"
    ).toBe(false);
  });

  it("returns false when HEADLESS environment variable is whitespace", async () => {
    expect.assertions(1);
    process.env["HEADLESS"] = "   ";
    const headless = new Headless();
    const result = await headless.value();
    delete process.env["HEADLESS"];
    expect(
      result,
      "Headless did not return false when HEADLESS environment variable was whitespace"
    ).toBe(false);
  });
});
