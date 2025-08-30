import { describe, expect, it } from "vitest";

import { Base64, Environment } from "#foxbot/value";

describe("LinkedInLogin", () => {
  it("decodes LinkedIn username from base64 environment variable", async () => {
    expect.assertions(1);
    delete process.env["LINKEDIN_USERNAME"];
    const username = Buffer.from("test@example.com", "utf-8").toString("base64");
    process.env["LINKEDIN_USERNAME"] = username;
    const usernameEnv = new Environment("LINKEDIN_USERNAME");
    const usernameBase64 = new Base64(usernameEnv);
    const decodedUsername = await usernameBase64.value();
    expect(decodedUsername, "LinkedIn username was not properly decoded from base64").toBe(
      "test@example.com"
    );
  });

  it("decodes LinkedIn password from base64 environment variable", async () => {
    expect.assertions(1);
    delete process.env["LINKEDIN_PASSWORD"];
    const password = Buffer.from("testpass123", "utf-8").toString("base64");
    process.env["LINKEDIN_PASSWORD"] = password;
    const passwordEnv = new Environment("LINKEDIN_PASSWORD");
    const passwordBase64 = new Base64(passwordEnv);
    const decodedPassword = await passwordBase64.value();
    expect(decodedPassword, "LinkedIn password was not properly decoded from base64").toBe(
      "testpass123"
    );
  });

  it("environment validation throws error when username is missing", async () => {
    expect.assertions(1);
    delete process.env["LINKEDIN_USERNAME"];
    delete process.env["LINKEDIN_PASSWORD"];
    process.env["LINKEDIN_PASSWORD"] = Buffer.from("testpass", "utf-8").toString("base64");

    const usernameEnv = new Environment("LINKEDIN_USERNAME");
    await expect(
      usernameEnv.value(),
      "Environment did not throw for missing LINKEDIN_USERNAME"
    ).rejects.toThrow("Environment variable LINKEDIN_USERNAME is not defined");
  });

  it("environment validation throws error when password is missing", async () => {
    expect.assertions(1);
    delete process.env["LINKEDIN_USERNAME"];
    delete process.env["LINKEDIN_PASSWORD"];
    process.env["LINKEDIN_USERNAME"] = Buffer.from("test@example.com", "utf-8").toString("base64");

    const passwordEnv = new Environment("LINKEDIN_PASSWORD");
    await expect(
      passwordEnv.value(),
      "Environment did not throw for missing LINKEDIN_PASSWORD"
    ).rejects.toThrow("Environment variable LINKEDIN_PASSWORD is not defined");
  });

  it("base64 validation throws error on invalid input", async () => {
    expect.assertions(1);
    delete process.env["INVALID_B64"];
    process.env["INVALID_B64"] = "invalid_base64!@#";

    const env = new Environment("INVALID_B64");
    const base64 = new Base64(env);
    await expect(base64.value(), "Base64 did not throw for invalid input").rejects.toThrow(
      "Input contains invalid base64 encoding"
    );
  });

  it("decodes unicode username from base64", async () => {
    expect.assertions(1);
    const unicodeUser = "тест@пример.рф";
    delete process.env["UNICODE_USER"];
    process.env["UNICODE_USER"] = Buffer.from(unicodeUser, "utf-8").toString("base64");
    const userEnv = new Environment("UNICODE_USER");
    const userBase64 = new Base64(userEnv);
    const decodedUser = await userBase64.value();
    expect(decodedUser, "Unicode username was not properly decoded").toBe(unicodeUser);
  });

  it("decodes unicode password from base64", async () => {
    expect.assertions(1);
    const unicodePass = "密码测试";
    delete process.env["UNICODE_PASS"];
    process.env["UNICODE_PASS"] = Buffer.from(unicodePass, "utf-8").toString("base64");
    const passEnv = new Environment("UNICODE_PASS");
    const passBase64 = new Base64(passEnv);
    const decodedPass = await passBase64.value();
    expect(decodedPass, "Unicode password was not properly decoded").toBe(unicodePass);
  });
});
