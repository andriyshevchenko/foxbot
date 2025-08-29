import { describe, it, expect } from "vitest";
import { JsonHost } from "#reachly/session/host";
import { TextLiteral } from "#foxbot/value";

/**
 * Tests for JsonHost methods extracting host attributes from JSON query.
 */
describe("JsonHost returns user agent from json query", () => {
  it("returns user agent", async () => {
    expect.assertions(1);
    const ua = `TestAgent/ユニコード_${Math.random().toString(36).substring(2, 7)}`;
    const json = `{"userAgent":"${ua}","locale":"uk-UA","timezone":"Europe/Kyiv","headers":{"X-Custom":"値"},"cookies":[{"name":"li_at","value":"c1","domain":".linkedin.com","path":"/","secure":true,"httpOnly":true}]}`;
    const host = new JsonHost(new TextLiteral(json));
    expect(await host.userAgent(), "JsonHost failed to return user agent").toBe(ua);
  });
});

describe("JsonHost returns locale from json query", () => {
  it("returns locale", async () => {
    expect.assertions(1);
    const locale = "ja-JP";
    const json = `{"userAgent":"UA","locale":"${locale}","timezone":"Asia/Tokyo","headers":{},"cookies":[]}`;
    const host = new JsonHost(new TextLiteral(json));
    expect(await host.locale(), "JsonHost failed to return locale").toBe(locale);
  });
});

describe("JsonHost returns timezone from json query", () => {
  it("returns timezone", async () => {
    expect.assertions(1);
    const tz = "America/Los_Angeles";
    const json = `{"userAgent":"UA","locale":"en-US","timezone":"${tz}","headers":{},"cookies":[]}`;
    const host = new JsonHost(new TextLiteral(json));
    expect(await host.timezone(), "JsonHost failed to return timezone").toBe(tz);
  });
});

describe("JsonHost returns headers from json query", () => {
  it("returns headers", async () => {
    expect.assertions(1);
    const headerVal = `値_${Math.random().toString(36).substring(2, 6)}`;
    const json = `{"userAgent":"UA","locale":"en-US","timezone":"UTC","headers":{"X-Test":"${headerVal}"},"cookies":[]}`;
    const host = new JsonHost(new TextLiteral(json));
    const headers = await host.headers();
    expect(headers["X-Test"], "JsonHost failed to return headers").toBe(headerVal);
  });
});

describe("JsonHost returns cookies json from json query", () => {
  it("returns cookies", async () => {
    expect.assertions(1);
    const cookies = [
      {
        name: "li_at",
        value: "α",
        domain: ".linkedin.com",
        path: "/",
        secure: true,
        httpOnly: true,
      },
      {
        name: "JSESSIONID",
        value: "β",
        domain: ".linkedin.com",
        path: "/",
        secure: true,
        httpOnly: true,
      },
    ];
    const json = `{"userAgent":"UA","locale":"en-US","timezone":"UTC","headers":{},"cookies":${JSON.stringify(cookies)}}`;
    const host = new JsonHost(new TextLiteral(json));
    expect(await host.cookies(), "JsonHost failed to return cookies json").toBe(
      JSON.stringify(cookies)
    );
  });
});
