import { describe, expect, it } from "vitest";
import { Base64 } from "#foxbot/value/base64";
import { TextLiteral } from "#foxbot/value/text_literal";

describe("Base64", () => {
  it("decodes valid base64 string correctly", async () => {
    expect.assertions(1);
    const encoded = Buffer.from("Hello World", "utf-8").toString("base64");
    const decoder = new Base64(new TextLiteral(encoded));
    const result = await decoder.value();
    expect(result, "Base64 did not decode valid base64 string correctly").toBe("Hello World");
  });

  it("throws error when input contains invalid base64 characters", async () => {
    expect.assertions(1);
    const decoder = new Base64(new TextLiteral("invalid_base64!@#"));
    await expect(decoder.value()).rejects.toThrow("Input contains invalid base64 encoding");
  });

  it("decodes unicode characters correctly", async () => {
    expect.assertions(1);
    const unicodeText = "тест用户名测试";
    const encoded = Buffer.from(unicodeText, "utf-8").toString("base64");
    const decoder = new Base64(new TextLiteral(encoded));
    const result = await decoder.value();
    expect(result, "Base64 did not decode unicode characters correctly").toBe(unicodeText);
  });

  it("decodes empty string correctly", async () => {
    expect.assertions(1);
    const encoded = Buffer.from("", "utf-8").toString("base64");
    const decoder = new Base64(new TextLiteral(encoded));
    const result = await decoder.value();
    expect(result, "Base64 did not decode empty string correctly").toBe("");
  });

  it("throws error when input has invalid padding", async () => {
    expect.assertions(1);
    const decoder = new Base64(new TextLiteral("SGVsbG8gV29ybGQ==="));
    await expect(decoder.value()).rejects.toThrow("Input contains invalid base64 encoding");
  });
});
