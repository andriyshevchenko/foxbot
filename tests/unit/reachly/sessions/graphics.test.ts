import { describe, it, expect } from "vitest";
import { JsonGraphics } from "../../../../reachly/session/graphics";
import { TextLiteral } from "../../../../foxbot/value";

/**
 * Tests for JsonGraphics extracting WebGL characteristics.
 */
describe("JsonGraphics returns webgl vendor from json query", () => {
  it("returns webgl vendor", async () => {
    expect.assertions(1);
    const vendor = "Google Inc. テスト";
    const json = `{"webglVendor":"${vendor}","webglRenderer":"ANGLE 測試"}`;
    const graphics = new JsonGraphics(new TextLiteral(json));
    expect(await graphics.webglVendor(), "JsonGraphics failed to return webgl vendor").toBe(vendor);
  });
});

describe("JsonGraphics returns webgl renderer from json query", () => {
  it("returns webgl renderer", async () => {
    expect.assertions(1);
    const renderer = "ANGLE (Intel(R) UHD Graphics 630)_测试";
    const json = `{"webglVendor":"Google","webglRenderer":"${renderer}"}`;
    const graphics = new JsonGraphics(new TextLiteral(json));
    expect(await graphics.webglRenderer(), "JsonGraphics failed to return webgl renderer").toBe(
      renderer
    );
  });
});
