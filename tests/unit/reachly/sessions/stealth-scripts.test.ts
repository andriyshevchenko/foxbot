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
} from "../../../../reachly/session/stealth-scripts";

describe("Stealth Scripts", () => {
  describe("removeWebDriverProperty", () => {
    it("should return script that removes webdriver property", () => {
      const script = removeWebDriverProperty();
      expect(script).toContain('"webdriver"');
      expect(script).toContain("get: () => undefined");
    });
  });

  describe("removeCdcProperties", () => {
    it("should return script that removes Chrome DevTools Console properties", () => {
      const script = removeCdcProperties();
      expect(script).toContain("cdc_adoQpoasnfa76pfcZLmcfl_Array");
      expect(script).toContain("cdc_adoQpoasnfa76pfcZLmcfl_Promise");
      expect(script).toContain("cdc_adoQpoasnfa76pfcZLmcfl_Symbol");
    });
  });

  describe("spoofChromeRuntime", () => {
    it("should return script that spoofs Chrome runtime", () => {
      const script = spoofChromeRuntime();
      expect(script).toContain('"chrome"');
      expect(script).toContain("runtime");
      expect(script).toContain("onConnect: undefined");
    });
  });

  describe("spoofPermissionsApi", () => {
    it("should return script that spoofs permissions API", () => {
      const script = spoofPermissionsApi();
      expect(script).toContain("navigator.permissions.query");
      expect(script).toContain("notifications");
    });
  });

  describe("spoofNavigatorPlugins", () => {
    it("should return script that spoofs navigator plugins", () => {
      const pluginLength = 1;
      const script = spoofNavigatorPlugins(pluginLength);
      expect(script).toContain('"plugins"');
      expect(script).toContain("Chrome PDF Plugin");
      expect(script).toContain(`length: ${pluginLength}`);
    });
  });

  describe("spoofNavigatorLanguages", () => {
    it("should return script that spoofs navigator languages", () => {
      const script = spoofNavigatorLanguages();
      expect(script).toContain('"languages"');
      expect(script).toContain("sessionData.host.locale()");
    });
  });

  describe("spoofDeviceProperties", () => {
    it("should return script that spoofs device properties", () => {
      const script = spoofDeviceProperties();
      expect(script).toContain('"platform"');
      expect(script).toContain('"deviceMemory"');
      expect(script).toContain('"hardwareConcurrency"');
    });
  });

  describe("spoofScreenProperties", () => {
    it("should return script that spoofs screen properties", () => {
      const defaultTaskbarHeight = 40;
      const script = spoofScreenProperties(defaultTaskbarHeight);
      expect(script).toContain('"width"');
      expect(script).toContain('"height"');
      expect(script).toContain('"availWidth"');
      expect(script).toContain('"availHeight"');
      expect(script).toContain(`${defaultTaskbarHeight}`);
    });
  });

  describe("spoofWebGLContext", () => {
    it("should return script that spoofs WebGL context", () => {
      const script = spoofWebGLContext();
      expect(script).toContain("HTMLCanvasElement.prototype.getContext");
      expect(script).toContain("webgl");
      expect(script).toContain("gl.VENDOR");
      expect(script).toContain("gl.RENDERER");
    });
  });

  describe("trackMouseMovements", () => {
    it("should return script that tracks mouse movements", () => {
      const maxMouseEvents = 50;
      const script = trackMouseMovements(maxMouseEvents);
      expect(script).toContain("mouseEvents");
      expect(script).toContain("mousemove");
      expect(script).toContain(`${maxMouseEvents}`);
    });
  });

  describe("addBoundingRectJitter", () => {
    it("should return script that adds jitter to bounding rect", () => {
      const jitterAmount = 0.1;
      const jitterOffset = 0.5;
      const script = addBoundingRectJitter(jitterAmount, jitterOffset);
      expect(script).toContain("getBoundingClientRect");
      expect(script).toContain(`${jitterAmount}`);
      expect(script).toContain(`${jitterOffset}`);
    });
  });

  describe("humanizeFetchTiming", () => {
    it("should return script that humanizes fetch timing", () => {
      const minDelayMs = 5;
      const maxDelayMs = 15;
      const script = humanizeFetchTiming(minDelayMs, maxDelayMs);
      expect(script).toContain("window.fetch");
      expect(script).toContain("setTimeout");
      expect(script).toContain(`${minDelayMs}`);
      expect(script).toContain(`${maxDelayMs}`);
    });
  });
});
