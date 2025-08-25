import { describe, it, expect } from "vitest";
import { JsonViewport } from "../../../../reachly/sessions/viewport";
import { TextLiteral } from "../../../../foxbot/builders";

/**
 * Tests for JsonViewport extracting dimensional attributes.
 */
describe("JsonViewport returns width from json query", () => {
  it("returns width", async () => {
    expect.assertions(1);
    const w = 1234;
    const json = `{"viewportWidth":${w},"viewportHeight":700,"screenWidth":2000,"screenHeight":1000,"devicePixelRatio":2,"taskbarHeight":48}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(await viewport.width(), "JsonViewport failed to return width").toBe(w);
  });
});

describe("JsonViewport returns height from json query", () => {
  it("returns height", async () => {
    expect.assertions(1);
    const h = 777;
    const json = `{"viewportWidth":800,"viewportHeight":${h},"screenWidth":2000,"screenHeight":1000,"devicePixelRatio":1,"taskbarHeight":40}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(await viewport.height(), "JsonViewport failed to return height").toBe(h);
  });
});

describe("JsonViewport returns screen width from json query", () => {
  it("returns screen width", async () => {
    expect.assertions(1);
    const sw = 3440;
    const json = `{"viewportWidth":900,"viewportHeight":600,"screenWidth":${sw},"screenHeight":1440,"devicePixelRatio":1.25,"taskbarHeight":42}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(await viewport.screenWidth(), "JsonViewport failed to return screen width").toBe(sw);
  });
});

describe("JsonViewport returns screen height from json query", () => {
  it("returns screen height", async () => {
    expect.assertions(1);
    const sh = 2160;
    const json = `{"viewportWidth":900,"viewportHeight":600,"screenWidth":3840,"screenHeight":${sh},"devicePixelRatio":1.25,"taskbarHeight":42}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(await viewport.screenHeight(), "JsonViewport failed to return screen height").toBe(sh);
  });
});

describe("JsonViewport returns device pixel ratio from json query", () => {
  it("returns device pixel ratio", async () => {
    expect.assertions(1);
    const dpr = 2.75;
    const json = `{"viewportWidth":900,"viewportHeight":600,"screenWidth":1920,"screenHeight":1080,"devicePixelRatio":${dpr},"taskbarHeight":50}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(
      await viewport.devicePixelRatio(),
      "JsonViewport failed to return device pixel ratio"
    ).toBe(dpr);
  });
});

describe("JsonViewport returns taskbar height from json query", () => {
  it("returns taskbar height", async () => {
    expect.assertions(1);
    const th = 55;
    const json = `{"viewportWidth":900,"viewportHeight":600,"screenWidth":1920,"screenHeight":1080,"devicePixelRatio":1,"taskbarHeight":${th}}`;
    const viewport = new JsonViewport(new TextLiteral(json));
    expect(await viewport.taskbarHeight(), "JsonViewport failed to return taskbar height").toBe(th);
  });
});
