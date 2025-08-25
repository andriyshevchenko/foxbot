import { describe, it, expect } from "vitest";
import { JsonLocation } from "../../../../reachly/sessions/location";
import { TextLiteral } from "../../../../foxbot/builders";

/**
 * Tests for JsonLocation extracting geolocation coordinates.
 */
describe("JsonLocation returns latitude from json query", () => {
  it("returns latitude", async () => {
    expect.assertions(1);
    const lat = 48.8566 + Math.random() * 0.001;
    const json = `{"latitude":${lat},"longitude":2.3522}`;
    const loc = new JsonLocation(new TextLiteral(json));
    expect(await loc.latitude(), "JsonLocation failed to return latitude").toBe(lat);
  });
});

describe("JsonLocation returns longitude from json query", () => {
  it("returns longitude", async () => {
    expect.assertions(1);
    const lon = 2.3522 + Math.random() * 0.001;
    const json = `{"latitude":48.8566,"longitude":${lon}}`;
    const loc = new JsonLocation(new TextLiteral(json));
    expect(await loc.longitude(), "JsonLocation failed to return longitude").toBe(lon);
  });
});
