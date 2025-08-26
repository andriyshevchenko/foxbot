import { describe, expect, it } from "vitest";
import { Environment } from "../../../../foxbot/value/environment";

describe("Environment", () => {
  it("returns environment variable value when defined", async () => {
    expect.assertions(1);
    process.env["TEST_VAR"] = "test_value";
    const env = new Environment("TEST_VAR");
    const result = await env.value();
    delete process.env["TEST_VAR"];
    expect(result, "Environment did not return environment variable value when defined").toBe(
      "test_value"
    );
  });

  it("throws error when environment variable is undefined", async () => {
    expect.assertions(1);
    delete process.env["MISSING_VAR"];
    const env = new Environment("MISSING_VAR");
    await expect(env.value()).rejects.toThrow("Environment variable MISSING_VAR is not defined");
  });

  it("throws error when environment variable is empty string", async () => {
    expect.assertions(1);
    process.env["EMPTY_VAR"] = "";
    const env = new Environment("EMPTY_VAR");
    await expect(env.value()).rejects.toThrow("Environment variable EMPTY_VAR is not defined");
    delete process.env["EMPTY_VAR"];
  });

  it("returns unicode environment variable value", async () => {
    expect.assertions(1);
    const unicodeValue = "тест_значение_用户名";
    process.env["UNICODE_VAR"] = unicodeValue;
    const env = new Environment("UNICODE_VAR");
    const result = await env.value();
    delete process.env["UNICODE_VAR"];
    expect(result, "Environment did not return unicode environment variable value").toBe(
      unicodeValue
    );
  });

  it("returns environment variable with special characters", async () => {
    expect.assertions(1);
    const specialValue = "test@example.com!#$%";
    process.env["SPECIAL_VAR"] = specialValue;
    const env = new Environment("SPECIAL_VAR");
    const result = await env.value();
    delete process.env["SPECIAL_VAR"];
    expect(result, "Environment did not return environment variable with special characters").toBe(
      specialValue
    );
  });
});
