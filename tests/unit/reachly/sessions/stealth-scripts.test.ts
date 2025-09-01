import { describe, expect, it } from "vitest";

import { NumberLiteral } from "#foxbot/core";
import type { Device } from "#reachly/session/device";
import type { Graphics } from "#reachly/session/graphics";
import type { Host } from "#reachly/session/host";
import type { Viewport } from "#reachly/session/viewport";

import {
  BoundingRectJitter,
  CdcRemoval,
  ChromeRuntime,
  DeviceProperties,
  FetchTiming,
  MouseTracking,
  NavigatorLanguages,
  NavigatorPlugins,
  PermissionsApi,
  ScreenProperties,
  WebDriverRemoval,
  WebGLContext,
} from "#reachly/session/stealth-scripts";

class HostStub implements Host {
  async userAgent(): Promise<string> {
    return "";
  }
  async locale(): Promise<string> {
    return "fr-CA";
  }
  async timezone(): Promise<string> {
    return "";
  }
  async headers(): Promise<Record<string, string>> {
    return {};
  }
  async cookies(): Promise<string> {
    return "";
  }
}

class DeviceStub implements Device {
  async platform(): Promise<string> {
    return "linux";
  }
  async deviceMemory(): Promise<number> {
    return 2;
  }
  async hardwareConcurrency(): Promise<number> {
    return 4;
  }
}

class ViewportStub implements Viewport {
  async width(): Promise<number> {
    return 1;
  }
  async height(): Promise<number> {
    return 1;
  }
  async screenWidth(): Promise<number> {
    return 10;
  }
  async screenHeight(): Promise<number> {
    return 20;
  }
  async devicePixelRatio(): Promise<number> {
    return 1;
  }
  async taskbarHeight(): Promise<number> {
    return 5;
  }
}

class GraphicsStub implements Graphics {
  async webglVendor(): Promise<string> {
    return "v";
  }
  async webglRenderer(): Promise<string> {
    return "r";
  }
}

describe("Stealth scripts", () => {
  it("creates webdriver removal script", async () => {
    expect.assertions(1);
    const script = await new WebDriverRemoval().value();
    expect(script, "WebDriverRemoval script lacked webdriver marker").toContain("webdriver");
  });

  it("creates cdc removal script", async () => {
    expect.assertions(1);
    const script = await new CdcRemoval().value();
    expect(script, "CdcRemoval script missed Array property").toContain(
      "cdc_adoQpoasnfa76pfcZLmcfl_Array"
    );
  });

  it("creates chrome runtime script", async () => {
    expect.assertions(1);
    const script = await new ChromeRuntime().value();
    expect(script, "ChromeRuntime script lacked chrome object").toContain('"chrome"');
  });

  it("creates permissions api script", async () => {
    expect.assertions(1);
    const script = await new PermissionsApi().value();
    expect(script, "PermissionsApi script lacked navigator.permissions.query").toContain(
      "navigator.permissions.query"
    );
  });

  it("creates navigator plugins script", async () => {
    expect.assertions(1);
    const script = await new NavigatorPlugins(new NumberLiteral(1)).value();
    expect(script, "NavigatorPlugins script lacked plugins property").toContain('"plugins"');
  });

  it("creates navigator languages script", async () => {
    expect.assertions(1);
    const script = await new NavigatorLanguages(new HostStub()).value();
    expect(script, "NavigatorLanguages script lacked languages property").toContain("languages");
  });

  it("creates device properties script", async () => {
    expect.assertions(1);
    const script = await new DeviceProperties(new DeviceStub()).value();
    expect(script, "DeviceProperties script lacked platform").toContain("platform");
  });

  it("creates screen properties script", async () => {
    expect.assertions(1);
    const script = await new ScreenProperties(new ViewportStub(), new NumberLiteral(40)).value();
    expect(script, "ScreenProperties script lacked width").toContain("width");
  });

  it("creates webgl context script", async () => {
    expect.assertions(1);
    const script = await new WebGLContext(new GraphicsStub()).value();
    expect(script, "WebGLContext script did not override getContext").toContain("getContext");
  });

  it("creates mouse tracking script", async () => {
    expect.assertions(1);
    const script = await new MouseTracking(new NumberLiteral(50)).value();
    expect(script, "MouseTracking script lacked mouseEvents").toContain("mouseEvents");
  });

  it("creates bounding rect jitter script", async () => {
    expect.assertions(1);
    const script = await new BoundingRectJitter(
      new NumberLiteral(0.1),
      new NumberLiteral(0.5)
    ).value();
    expect(script, "BoundingRectJitter script did not override getBoundingClientRect").toContain(
      "getBoundingClientRect"
    );
  });

  it("creates fetch timing script", async () => {
    expect.assertions(1);
    const script = await new FetchTiming(new NumberLiteral(5), new NumberLiteral(15)).value();
    expect(script, "FetchTiming script did not override window.fetch").toContain("window.fetch");
  });
});
