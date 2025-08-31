/* eslint-disable @typescript-eslint/no-explicit-any */
/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";
import type { Query } from "#foxbot/core";
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

async function run(q: Query<string>): Promise<void> {
  eval(await q.value());
}

describe("stealth scripts", () => {
  it("removes webdriver property", async () => {
    Object.defineProperty(navigator, "webdriver", { value: true, configurable: true });
    await run(new WebDriverRemoval());
    expect((navigator as any).webdriver).toBeUndefined();
  });

  it("removes cdc properties", async () => {
    (window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Array"] = 1;
    (window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Promise"] = 1;
    (window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Symbol"] = 1;
    await run(new CdcRemoval());
    expect((window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Array"]).toBeUndefined();
    expect((window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Promise"]).toBeUndefined();
    expect((window as any)["cdc_adoQpoasnfa76pfcZLmcfl_Symbol"]).toBeUndefined();
  });

  it("spoofs chrome runtime", async () => {
    await run(new ChromeRuntime());
    expect((window as any).chrome.runtime).toBeDefined();
  });

  it("spoofs permissions api", async () => {
    const original = vi.fn().mockResolvedValue({ state: "prompt" });
    (navigator as any).permissions = { query: original };
    (globalThis as any).Notification = { permission: "granted" };
    await run(new PermissionsApi());
    await expect(navigator.permissions.query({ name: "notifications" } as any)).resolves.toEqual({
      state: "granted",
    });
    await navigator.permissions.query({ name: "geolocation" } as any);
    expect(original).toHaveBeenCalledWith({ name: "geolocation" });
  });

  it("spoofs navigator plugins", async () => {
    await run(new NavigatorPlugins(1));
    expect(navigator.plugins.length).toBe(1);
    expect(navigator.plugins[0].name).toBe("Chrome PDF Plugin");
  });

  it("spoofs navigator languages", async () => {
    await run(new NavigatorLanguages("en-US"));
    expect(navigator.languages).toEqual(["en-US", "en"]);
  });

  it("spoofs device properties", async () => {
    await run(new DeviceProperties({ platform: "Linux", deviceMemory: 8, hardwareConcurrency: 4 }));
    expect(navigator.platform).toBe("Linux");
    expect((navigator as any).deviceMemory).toBe(8);
    expect(navigator.hardwareConcurrency).toBe(4);
  });

  it("spoofs screen properties", async () => {
    await run(new ScreenProperties({ width: 1920, height: 1080, taskbar: 40 }));
    expect(screen.width).toBe(1920);
    expect(screen.height).toBe(1080);
    expect(screen.availWidth).toBe(1920);
    expect(screen.availHeight).toBe(1040);
  });

  it("spoofs webgl context", async () => {
    const context = {
      VENDOR: 1,
      RENDERER: 2,
      getParameter: vi.fn((p: any) => `orig-${p}`),
    } as any;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => context);
    await run(new WebGLContext({ vendor: "Vendor", renderer: "Renderer" }));
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as any;
    expect(gl.getParameter(gl.VENDOR)).toBe("Vendor");
    expect(gl.getParameter(gl.RENDERER)).toBe("Renderer");
  });

  it("adds bounding rect jitter", async () => {
    const originalRandom = Math.random;
    Math.random = () => 0.6;
    const el = document.createElement("div");
    document.body.appendChild(el);
    const before = el.getBoundingClientRect();
    await run(new BoundingRectJitter({ amount: 1, offset: 0 }));
    const after = el.getBoundingClientRect();
    expect(after.x).toBeCloseTo(before.x + 0.6);
    Math.random = originalRandom;
  });

  it("humanizes fetch timing", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.fn().mockResolvedValue("ok");
    (globalThis as any).fetch = fetchSpy;
    await run(new FetchTiming({ minDelayMs: 10, maxDelayMs: 10 }));
    const promise = fetch("/test");
    vi.advanceTimersByTime(9);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    await promise;
    expect(fetchSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("tracks mouse movements", async () => {
    await run(new MouseTracking(2));
    const event = new MouseEvent("mousemove", { clientX: 1, clientY: 1 });
    document.dispatchEvent(event);
    document.dispatchEvent(event);
    document.dispatchEvent(event);
    expect((window as any).__mouseEvents.length).toBe(2);
  });
});
