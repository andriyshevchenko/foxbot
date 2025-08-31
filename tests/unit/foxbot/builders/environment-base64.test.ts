import { describe, expect, it } from "vitest";
import { EnvironmentBase64 } from "#foxbot/value/environment_base64";

describe("EnvironmentBase64", () => {
  it("returns decoded value when environment variable contains valid base64", async () => {
    expect.assertions(1);
    process.env["TEST_VAR"] = Buffer.from("test@example.com", "utf-8").toString("base64");
    const env = new EnvironmentBase64("TEST_VAR");
    const result = await env.value();
    delete process.env["TEST_VAR"];
    expect(result, "EnvironmentBase64 did not decode valid base64 correctly").toBe(
      "test@example.com"
    );
  });

  it("throws error when environment variable is missing", async () => {
    expect.assertions(1);
    delete process.env["MISSING_VAR"];
    const env = new EnvironmentBase64("MISSING_VAR");
    await expect(env.value()).rejects.toThrow("Environment variable MISSING_VAR is not defined");
  });

  it("throws error when environment variable contains invalid base64", async () => {
    expect.assertions(1);
    process.env["INVALID_VAR"] = "invalid_base64_!@#";
    const env = new EnvironmentBase64("INVALID_VAR");
    await expect(env.value()).rejects.toThrow(
      "Environment variable INVALID_VAR contains invalid base64 encoding"
    );
    delete process.env["INVALID_VAR"];
  });

  it("decodes unicode characters correctly", async () => {
    expect.assertions(1);
    const unicodeText = "тест用户名";
    process.env["UNICODE_VAR"] = Buffer.from(unicodeText, "utf-8").toString("base64");
    const env = new EnvironmentBase64("UNICODE_VAR");
    const result = await env.value();
    delete process.env["UNICODE_VAR"];
    expect(result, "EnvironmentBase64 did not decode unicode characters correctly").toBe(
      unicodeText
    );
  });

  it("throws error when environment variable is empty string", async () => {
    expect.assertions(1);
    process.env["EMPTY_VAR"] = "";
    const env = new EnvironmentBase64("EMPTY_VAR");
    await expect(env.value()).rejects.toThrow("Environment variable EMPTY_VAR is not defined");
    delete process.env["EMPTY_VAR"];
  });
});
