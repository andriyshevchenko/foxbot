import { describe, expect, it } from "vitest";
import {
  addBoundingRectJitter,
  humanizeFetchTiming,
  removeCdcProperties,
  removeWebDriverProperty,
  spoofChromeRuntime,
  spoofDeviceProperties,
  spoofNavigatorLanguages,
  spoofNavigatorPlugins,
  spoofPermissionsApi,
  spoofScreenProperties,
  spoofWebGLContext,
  trackMouseMovements,
} from "#reachly/session/stealth-scripts";

describe("Stealth Scripts", () => {
  describe("removeWebDriverProperty", () => {
    it("returns script including webdriver property marker", () => {
      expect.assertions(1);
      const script = removeWebDriverProperty();
      expect(script, "removeWebDriverProperty script lacked webdriver marker").toContain(
        '"webdriver"'
      );
    });
    it("returns script defining webdriver getter to no value", () => {
      expect.assertions(1);
      const script = removeWebDriverProperty();
      const none = `${void 0}`;
      expect(script, "removeWebDriverProperty script did not define getter to no value").toContain(
        `get: () => ${none}`
      );
    });
  });

  describe("removeCdcProperties", () => {
    it("returns script removing cdc Array property", () => {
      expect.assertions(1);
      const script = removeCdcProperties();
      expect(script, "removeCdcProperties script missed Array property").toContain(
        "cdc_adoQpoasnfa76pfcZLmcfl_Array"
      );
    });
    it("returns script removing cdc Promise property", () => {
      expect.assertions(1);
      const script = removeCdcProperties();
      expect(script, "removeCdcProperties script missed Promise property").toContain(
        "cdc_adoQpoasnfa76pfcZLmcfl_Promise"
      );
    });
    it("returns script removing cdc Symbol property", () => {
      expect.assertions(1);
      const script = removeCdcProperties();
      expect(script, "removeCdcProperties script missed Symbol property").toContain(
        "cdc_adoQpoasnfa76pfcZLmcfl_Symbol"
      );
    });
  });

  describe("spoofChromeRuntime", () => {
    it("returns script including chrome object", () => {
      expect.assertions(1);
      const script = spoofChromeRuntime();
      expect(script, "spoofChromeRuntime script lacked chrome object").toContain('"chrome"');
    });
    it("returns script including runtime property", () => {
      expect.assertions(1);
      const script = spoofChromeRuntime();
      expect(script, "spoofChromeRuntime script lacked runtime property").toContain("runtime");
    });
    it("returns script setting onConnect to no value", () => {
      expect.assertions(1);
      const script = spoofChromeRuntime();
      const none = `${void 0}`;
      expect(script, "spoofChromeRuntime script did not set onConnect to no value").toContain(
        `onConnect: ${none}`
      );
    });
  });

  describe("spoofPermissionsApi", () => {
    it("returns script spoofing permissions query", () => {
      expect.assertions(1);
      const script = spoofPermissionsApi();
      expect(script, "spoofPermissionsApi script lacked navigator.permissions.query").toContain(
        "navigator.permissions.query"
      );
    });
    it("returns script spoofing notifications permission", () => {
      expect.assertions(1);
      const script = spoofPermissionsApi();
      expect(script, "spoofPermissionsApi script lacked notifications spoof").toContain(
        "notifications"
      );
    });
  });

  describe("spoofNavigatorPlugins", () => {
    it("returns script including plugins property", () => {
      expect.assertions(1);
      const pluginLength = 1;
      const script = spoofNavigatorPlugins(pluginLength);
      expect(script, "spoofNavigatorPlugins script lacked plugins property").toContain('"plugins"');
    });
    it("returns script spoofing Chrome PDF Plugin", () => {
      expect.assertions(1);
      const pluginLength = 1;
      const script = spoofNavigatorPlugins(pluginLength);
      expect(script, "spoofNavigatorPlugins script lacked Chrome PDF Plugin").toContain(
        "Chrome PDF Plugin"
      );
    });
    it("returns script setting plugin length", () => {
      expect.assertions(1);
      const pluginLength = 1;
      const script = spoofNavigatorPlugins(pluginLength);
      expect(script, "spoofNavigatorPlugins script did not set plugin length").toContain(
        `length: ${pluginLength}`
      );
    });
  });

  describe("spoofNavigatorLanguages", () => {
    it("returns script including languages property", () => {
      expect.assertions(1);
      const script = spoofNavigatorLanguages();
      expect(script, "spoofNavigatorLanguages script lacked languages property").toContain(
        '"languages"'
      );
    });
    it("returns script referencing session locale", () => {
      expect.assertions(1);
      const script = spoofNavigatorLanguages();
      expect(script, "spoofNavigatorLanguages script did not reference session locale").toContain(
        "sessionData.host.locale()"
      );
    });
  });

  describe("spoofDeviceProperties", () => {
    it("returns script including platform property", () => {
      expect.assertions(1);
      const script = spoofDeviceProperties();
      expect(script, "spoofDeviceProperties script lacked platform property").toContain(
        '"platform"'
      );
    });
    it("returns script including deviceMemory property", () => {
      expect.assertions(1);
      const script = spoofDeviceProperties();
      expect(script, "spoofDeviceProperties script lacked deviceMemory property").toContain(
        '"deviceMemory"'
      );
    });
    it("returns script including hardwareConcurrency property", () => {
      expect.assertions(1);
      const script = spoofDeviceProperties();
      expect(script, "spoofDeviceProperties script lacked hardwareConcurrency property").toContain(
        '"hardwareConcurrency"'
      );
    });
  });

  describe("spoofScreenProperties", () => {
    it("returns script including width property", () => {
      expect.assertions(1);
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script, "spoofScreenProperties script lacked width property").toContain('"width"');
    });
    it("returns script including height property", () => {
      expect.assertions(1);
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script, "spoofScreenProperties script lacked height property").toContain('"height"');
    });
    it("returns script including availWidth property", () => {
      expect.assertions(1);
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script, "spoofScreenProperties script lacked availWidth property").toContain(
        '"availWidth"'
      );
    });
    it("returns script including availHeight property", () => {
      expect.assertions(1);
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script, "spoofScreenProperties script lacked availHeight property").toContain(
        '"availHeight"'
      );
    });
    it("returns script using taskbar height", () => {
      expect.assertions(1);
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script, "spoofScreenProperties script did not use taskbar height").toContain(
        `${defaultTaskbarHeight}`
      );
    });
  });

  describe("spoofWebGLContext", () => {
    it("returns script overriding getContext", () => {
      expect.assertions(1);
      const script = spoofWebGLContext();
      expect(script, "spoofWebGLContext script did not override getContext").toContain(
        "HTMLCanvasElement.prototype.getContext"
      );
    });
    it("returns script referencing webgl", () => {
      expect.assertions(1);
      const script = spoofWebGLContext();
      expect(script, "spoofWebGLContext script did not reference webgl").toContain("webgl");
    });
    it("returns script spoofing gl.VENDOR", () => {
      expect.assertions(1);
      const script = spoofWebGLContext();
      expect(script, "spoofWebGLContext script did not spoof gl.VENDOR").toContain("gl.VENDOR");
    });
    it("returns script spoofing gl.RENDERER", () => {
      expect.assertions(1);
      const script = spoofWebGLContext();
      expect(script, "spoofWebGLContext script did not spoof gl.RENDERER").toContain("gl.RENDERER");
    });
  });

  describe("trackMouseMovements", () => {
    it("returns script including mouseEvents array", () => {
      expect.assertions(1);
      const maxMouseEvents = 50;
      const script = trackMouseMovements(maxMouseEvents);
      expect(script, "trackMouseMovements script lacked mouseEvents").toContain("mouseEvents");
    });
    it("returns script registering mousemove", () => {
      expect.assertions(1);
      const maxMouseEvents = 50;
      const script = trackMouseMovements(maxMouseEvents);
      expect(script, "trackMouseMovements script did not register mousemove").toContain(
        "mousemove"
      );
    });
    it("returns script using max mouse events", () => {
      expect.assertions(1);
      const maxMouseEvents = 50;
      const script = trackMouseMovements(maxMouseEvents);
      expect(script, "trackMouseMovements script did not use max mouse events").toContain(
        `${maxMouseEvents}`
      );
    });
  });

  describe("addBoundingRectJitter", () => {
    it("returns script overriding getBoundingClientRect", () => {
      expect.assertions(1);
      const jitterAmount = 0.1;
      const jitterOffset = 0.5;
      const script = addBoundingRectJitter(jitterAmount, jitterOffset);
      expect(
        script,
        "addBoundingRectJitter script did not override getBoundingClientRect"
      ).toContain("getBoundingClientRect");
    });
    it("returns script using jitter amount", () => {
      expect.assertions(1);
      const jitterAmount = 0.1;
      const jitterOffset = 0.5;
      const script = addBoundingRectJitter(jitterAmount, jitterOffset);
      expect(script, "addBoundingRectJitter script did not use jitter amount").toContain(
        `${jitterAmount}`
      );
    });
    it("returns script using jitter offset", () => {
      expect.assertions(1);
      const jitterAmount = 0.1;
      const jitterOffset = 0.5;
      const script = addBoundingRectJitter(jitterAmount, jitterOffset);
      expect(script, "addBoundingRectJitter script did not use jitter offset").toContain(
        `${jitterOffset}`
      );
    });
  });

  describe("humanizeFetchTiming", () => {
    it("returns script overriding window.fetch", () => {
      expect.assertions(1);
      const minDelayMs = 5;
      const maxDelayMs = 15;
      const script = humanizeFetchTiming(minDelayMs, maxDelayMs);
      expect(script, "humanizeFetchTiming script did not override window.fetch").toContain(
        "window.fetch"
      );
    });
    it("returns script using setTimeout", () => {
      expect.assertions(1);
      const minDelayMs = 5;
      const maxDelayMs = 15;
      const script = humanizeFetchTiming(minDelayMs, maxDelayMs);
      expect(script, "humanizeFetchTiming script did not use setTimeout").toContain("setTimeout");
    });
    it("returns script using minimum delay", () => {
      expect.assertions(1);
      const minDelayMs = 5;
      const maxDelayMs = 15;
      const script = humanizeFetchTiming(minDelayMs, maxDelayMs);
      expect(script, "humanizeFetchTiming script did not use minimum delay").toContain(
        `${minDelayMs}`
      );
    });
    it("returns script using maximum delay", () => {
      expect.assertions(1);
      const minDelayMs = 5;
      const maxDelayMs = 15;
      const script = humanizeFetchTiming(minDelayMs, maxDelayMs);
      expect(script, "humanizeFetchTiming script did not use maximum delay").toContain(
        `${maxDelayMs}`
      );
    });
  });
});
