import { describe, expect, it } from "vitest";
import type { BrowserContext } from "playwright";

import { NumberLiteral } from "#foxbot/core";
import { StealthSession } from "#reachly/session/stealth-session";
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

import type { Session } from "#foxbot/session";
import type { Device } from "#reachly/session/device";
import type { Graphics } from "#reachly/session/graphics";
import type { Host } from "#reachly/session/host";
import type { Viewport } from "#reachly/session/viewport";

class FakeContext {
  scripts: object[] = [];
  async addInitScript(script: object): Promise<void> {
    this.scripts.push(script);
  }
}

function assertBrowserContext(obj: object): asserts obj is BrowserContext {
  if (!("addInitScript" in obj)) {
    throw new Error("context missing addInitScript");
  }
}

class Base implements Session {
  constructor(private readonly ctx: object) {}
  async profile(): Promise<BrowserContext> {
    assertBrowserContext(this.ctx);
    return this.ctx;
  }
}

class View implements Viewport {
  async width(): Promise<number> {
    return 1;
  }
  async height(): Promise<number> {
    return 1;
  }
  async screenWidth(): Promise<number> {
    return 1;
  }
  async screenHeight(): Promise<number> {
    return 1;
  }
  async devicePixelRatio(): Promise<number> {
    return 1;
  }
  async taskbarHeight(): Promise<number> {
    return 0;
  }
}

class Graf implements Graphics {
  async webglVendor(): Promise<string> {
    return "v";
  }
  async webglRenderer(): Promise<string> {
    return "r";
  }
}

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

describe("StealthSession", () => {
  it("injects all stealth scripts into context", async () => {
    expect.assertions(1);
    const context = new FakeContext();
    const base = new Base(context);
    const view = new View();
    const graphics = new Graf();
    const host = new HostStub();
    const device = new DeviceStub();
    const scripts = [
      new WebDriverRemoval(),
      new CdcRemoval(),
      new ChromeRuntime(),
      new PermissionsApi(),
      new NavigatorPlugins(new NumberLiteral(1)),
      new NavigatorLanguages(host),
      new DeviceProperties(device),
      new ScreenProperties(view, new NumberLiteral(40)),
      new WebGLContext(graphics),
      new MouseTracking(new NumberLiteral(50)),
      new BoundingRectJitter(new NumberLiteral(0.1), new NumberLiteral(0.5)),
      new FetchTiming(new NumberLiteral(5), new NumberLiteral(15)),
    ];
    const stealth = new StealthSession(base, scripts);
    await stealth.profile();
    expect(context.scripts.length, "StealthSession failed to inject every script").toBe(12);
  });
});
