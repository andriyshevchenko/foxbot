import { describe, expect, it } from "vitest";
import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import { StealthSession } from "#reachly/session/stealth-session";
import type { Device } from "#reachly/session/device";
import type { Graphics } from "#reachly/session/graphics";
import type { Host } from "#reachly/session/host";
import type { Location } from "#reachly/session/location";
import type { Viewport } from "#reachly/session/viewport";

class FakeContext {
  scripts: object[] = [];
  async addInitScript(script: object): Promise<void> {
    this.scripts.push(script);
  }
}

class Base implements Session {
  constructor(private readonly ctx: FakeContext) {}
  async profile(): Promise<BrowserContext> {
    // @ts-expect-error minimal context
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

class Place implements Location {
  async latitude(): Promise<number> {
    return 0;
  }
  async longitude(): Promise<number> {
    return 0;
  }
}

describe("StealthSession", () => {
  it("injects all stealth scripts into context", async () => {
    expect.assertions(1);
    const ctx = new FakeContext();
    const base = new Base(ctx);
    const view = new View();
    const graf = new Graf();
    const host = new HostStub();
    const device = new DeviceStub();
    const place = new Place();
    const stealth = new StealthSession(base, view, graf, host, device, place);
    await stealth.profile();
    expect(ctx.scripts.length, "StealthSession failed to inject every script").toBe(12);
  });
});
