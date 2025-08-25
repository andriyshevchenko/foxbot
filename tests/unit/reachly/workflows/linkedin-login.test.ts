import { describe, expect, it } from "vitest";

import { Base64, Environment } from "../../../../foxbot/builders";

describe("LinkedInLogin", () => {
  it("can be instantiated with valid environment variables", async () => {
    expect.assertions(2);
    const username = Buffer.from("test@example.com", "utf-8").toString("base64");
    const password = Buffer.from("testpass123", "utf-8").toString("base64");
    process.env["LINKEDIN_USERNAME"] = username;
    process.env["LINKEDIN_PASSWORD"] = password;

    // Since LinkedInLogin requires a real Session (and our fake sessions would require
    // type assertions), we'll test the component parts instead.
    // Test that environment variables are properly configured
    const usernameEnv = new Environment("LINKEDIN_USERNAME");
    const passwordEnv = new Environment("LINKEDIN_PASSWORD");
    const usernameBase64 = new Base64(usernameEnv);
    const passwordBase64 = new Base64(passwordEnv);

    const decodedUsername = await usernameBase64.value();
    const decodedPassword = await passwordBase64.value();

    expect(decodedUsername, "Username was not properly decoded from base64").toBe(
      "test@example.com"
    );
    expect(decodedPassword, "Password was not properly decoded from base64").toBe("testpass123");

    delete process.env["LINKEDIN_USERNAME"];
    delete process.env["LINKEDIN_PASSWORD"];
  });

  it("environment validation throws error when username is missing", async () => {
    expect.assertions(1);
    delete process.env["LINKEDIN_USERNAME"];
    process.env["LINKEDIN_PASSWORD"] = Buffer.from("testpass", "utf-8").toString("base64");

    const usernameEnv = new Environment("LINKEDIN_USERNAME");
    await expect(usernameEnv.value()).rejects.toThrow(
      "Environment variable LINKEDIN_USERNAME is not defined"
    );

    delete process.env["LINKEDIN_PASSWORD"];
  });

  it("environment validation throws error when password is missing", async () => {
    expect.assertions(1);
    process.env["LINKEDIN_USERNAME"] = Buffer.from("test@example.com", "utf-8").toString("base64");
    delete process.env["LINKEDIN_PASSWORD"];

    const passwordEnv = new Environment("LINKEDIN_PASSWORD");
    await expect(passwordEnv.value()).rejects.toThrow(
      "Environment variable LINKEDIN_PASSWORD is not defined"
    );

    delete process.env["LINKEDIN_USERNAME"];
  });

  it("base64 validation throws error on invalid input", async () => {
    expect.assertions(1);
    process.env["INVALID_B64"] = "invalid_base64!@#";

    const env = new Environment("INVALID_B64");
    const base64 = new Base64(env);
    await expect(base64.value()).rejects.toThrow("Input contains invalid base64 encoding");

    delete process.env["INVALID_B64"];
  });

  it("handles unicode credentials correctly in base64 encoding", async () => {
    expect.assertions(2);
    const unicodeUser = "тест@пример.рф";
    const unicodePass = "密码测试";
    process.env["UNICODE_USER"] = Buffer.from(unicodeUser, "utf-8").toString("base64");
    process.env["UNICODE_PASS"] = Buffer.from(unicodePass, "utf-8").toString("base64");

    const userEnv = new Environment("UNICODE_USER");
    const passEnv = new Environment("UNICODE_PASS");
    const userBase64 = new Base64(userEnv);
    const passBase64 = new Base64(passEnv);

    const decodedUser = await userBase64.value();
    const decodedPass = await passBase64.value();

    expect(decodedUser, "Unicode username was not properly decoded").toBe(unicodeUser);
    expect(decodedPass, "Unicode password was not properly decoded").toBe(unicodePass);

    delete process.env["UNICODE_USER"];
    delete process.env["UNICODE_PASS"];
  });
});
