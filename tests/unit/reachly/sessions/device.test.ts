import { describe, it, expect } from "vitest";
import { JsonDevice } from "../../../../reachly/session/device";
import { TextLiteral } from "../../../../foxbot/value";

/**
 * Tests for JsonDevice extracting device characteristics.
 */
describe("JsonDevice returns platform from json query", () => {
  it("returns platform", async () => {
    expect.assertions(1);
    const platform = "Win32_测试";
    const json = `{"platform":"${platform}","deviceMemory":16,"hardwareConcurrency":12}`;
    const device = new JsonDevice(new TextLiteral(json));
    expect(await device.platform(), "JsonDevice failed to return platform").toBe(platform);
  });
});

describe("JsonDevice returns device memory from json query", () => {
  it("returns device memory", async () => {
    expect.assertions(1);
    const mem = 32;
    const json = `{"platform":"X","deviceMemory":${mem},"hardwareConcurrency":8}`;
    const device = new JsonDevice(new TextLiteral(json));
    expect(await device.deviceMemory(), "JsonDevice failed to return device memory").toBe(mem);
  });
});

describe("JsonDevice returns hardware concurrency from json query", () => {
  it("returns hardware concurrency", async () => {
    expect.assertions(1);
    const cores = 24;
    const json = `{"platform":"X","deviceMemory":8,"hardwareConcurrency":${cores}}`;
    const device = new JsonDevice(new TextLiteral(json));
    expect(
      await device.hardwareConcurrency(),
      "JsonDevice failed to return hardware concurrency"
    ).toBe(cores);
  });
});
