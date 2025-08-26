import type { BrowserContext } from "playwright";
import type { Session } from "../../foxbot/playwright/session";
import type { Device } from "./device";
import type { Graphics } from "./graphics";
import type { Host } from "./host";
import type { Location } from "./location";
import { SessionDecorator } from "./session-decorator";
import {
  addBoundingRectJitter,
  humanizeFetchTiming,
  removeCdcProperties,
  removeWebDriverProperty,
  spoofChromeRuntime,
  spoofNavigatorPlugins,
  spoofPermissionsApi,
  trackMouseMovements,
} from "./stealth-scripts";
import type { Viewport } from "./viewport";

/**
 * Decorator to inject stealth scripts into a session.
 */
export class StealthSession extends SessionDecorator {
  private static readonly DEFAULT_TASKBAR_HEIGHT = 40;
  private static readonly PLUGIN_LENGTH = 1;
  private static readonly MAX_MOUSE_EVENTS = 50;
  private static readonly BOUNDING_RECT_JITTER_AMOUNT = 0.1;
  private static readonly JITTER_OFFSET = 0.5;
  private static readonly MIN_FETCH_DELAY_MS = 5;
  private static readonly MAX_FETCH_DELAY_MS = 15;

  constructor(
    session: Session,
    private readonly viewport: Viewport,
    private readonly graphics: Graphics,
    private readonly hostConfig: Host,
    private readonly device: Device,
    private readonly location: Location
  ) {
    super(session);
  }

  async open(): Promise<void> {
    await this.injectStealthScripts();
  }

  /**
   * Injects stealth scripts to mask automation indicators and mimic human behavior.
   */
  private async injectStealthScripts(): Promise<void> {
    const context = await this.host();
    const sessionData = {
      viewport: this.viewport,
      graphics: this.graphics,
      host: this.hostConfig,
      device: this.device,
      location: this.location,
    };

    // Inject each stealth script separately for better modularity
    await this.injectWebDriverRemoval(context);
    await this.injectCdcRemoval(context);
    await this.injectChromeRuntimeSpoof(context);
    await this.injectPermissionsApiSpoof(context);
    await this.injectNavigatorPluginsSpoof(context);
    await this.injectNavigatorLanguagesSpoof(context, sessionData);
    await this.injectDevicePropertiesSpoof(context, sessionData);
    await this.injectScreenPropertiesSpoof(context, sessionData);
    await this.injectWebGLContextSpoof(context, sessionData);
    await this.injectMouseTracking(context);
    await this.injectBoundingRectJitter(context);
    await this.injectFetchTimingHumanization(context);
  }

  private async injectWebDriverRemoval(context: BrowserContext): Promise<void> {
    await context.addInitScript(removeWebDriverProperty());
  }

  private async injectCdcRemoval(context: BrowserContext): Promise<void> {
    await context.addInitScript(removeCdcProperties());
  }

  private async injectChromeRuntimeSpoof(context: BrowserContext): Promise<void> {
    await context.addInitScript(spoofChromeRuntime());
  }

  private async injectPermissionsApiSpoof(context: BrowserContext): Promise<void> {
    await context.addInitScript(spoofPermissionsApi());
  }

  private async injectNavigatorPluginsSpoof(context: BrowserContext): Promise<void> {
    await context.addInitScript(spoofNavigatorPlugins(StealthSession.PLUGIN_LENGTH));
  }

  private async injectNavigatorLanguagesSpoof(
    context: BrowserContext,
    sessionData: {
      viewport: Viewport;
      graphics: Graphics;
      host: Host;
      device: Device;
      location: Location;
    }
  ): Promise<void> {
    await context.addInitScript(async (sessionData) => {
      const localeString = await sessionData.host.locale();
      const localeParts = localeString.split("-");
      Object.defineProperty(navigator, "languages", {
        get: () => [localeString, localeParts[0]],
      });
    }, sessionData);
  }

  private async injectDevicePropertiesSpoof(
    context: BrowserContext,
    sessionData: {
      viewport: Viewport;
      graphics: Graphics;
      host: Host;
      device: Device;
      location: Location;
    }
  ): Promise<void> {
    await context.addInitScript(async (sessionData) => {
      if (await sessionData.device.platform()) {
        Object.defineProperty(navigator, "platform", {
          get: async () => await sessionData.device.platform(),
        });
      }

      if (await sessionData.device.deviceMemory()) {
        Object.defineProperty(navigator, "deviceMemory", {
          get: async () => await sessionData.device.deviceMemory(),
        });
      }

      if (await sessionData.device.hardwareConcurrency()) {
        Object.defineProperty(navigator, "hardwareConcurrency", {
          get: async () => await sessionData.device.hardwareConcurrency(),
        });
      }
    }, sessionData);
  }

  private async injectScreenPropertiesSpoof(
    context: BrowserContext,
    sessionData: {
      viewport: Viewport;
      graphics: Graphics;
      host: Host;
      device: Device;
      location: Location;
    }
  ): Promise<void> {
    await context.addInitScript(async (sessionData) => {
      Object.defineProperty(screen, "width", {
        get: async () => await sessionData.viewport.screenWidth(),
      });

      Object.defineProperty(screen, "height", {
        get: async () => await sessionData.viewport.screenHeight(),
      });

      Object.defineProperty(screen, "availWidth", {
        get: async () => await sessionData.viewport.screenWidth(),
      });

      const screenHeight = await sessionData.viewport.screenHeight();
      const taskbarHeight = (await sessionData.viewport.taskbarHeight()) || 40;
      Object.defineProperty(screen, "availHeight", {
        get: () => screenHeight - taskbarHeight,
      });
    }, sessionData);
  }

  private async injectWebGLContextSpoof(
    context: BrowserContext,
    sessionData: {
      viewport: Viewport;
      graphics: Graphics;
      host: Host;
      device: Device;
      location: Location;
    }
  ): Promise<void> {
    await context.addInitScript(async (sessionData) => {
      if (
        (await sessionData.graphics.webglVendor()) ||
        (await sessionData.graphics.webglRenderer())
      ) {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          contextType: string,
          ...args: unknown[]
        ) {
          const context = originalGetContext.call(this, contextType, ...args);
          if ((contextType === "webgl" || contextType === "experimental-webgl") && context) {
            const gl = context as WebGLRenderingContext;
            const originalGetParameter = gl.getParameter;
            gl.getParameter = async function (pname: number) {
              if (pname === gl.VENDOR && (await sessionData.graphics.webglVendor())) {
                return await sessionData.graphics.webglVendor();
              }
              if (pname === gl.RENDERER && (await sessionData.graphics.webglRenderer())) {
                return await sessionData.graphics.webglRenderer();
              }
              return originalGetParameter.call(this, pname);
            };
          }
          return context;
        } as typeof HTMLCanvasElement.prototype.getContext;
      }
    }, sessionData);
  }

  private async injectMouseTracking(context: BrowserContext): Promise<void> {
    await context.addInitScript(trackMouseMovements(StealthSession.MAX_MOUSE_EVENTS));
  }

  private async injectBoundingRectJitter(context: BrowserContext): Promise<void> {
    await context.addInitScript(
      addBoundingRectJitter(
        StealthSession.BOUNDING_RECT_JITTER_AMOUNT,
        StealthSession.JITTER_OFFSET
      )
    );
  }

  private async injectFetchTimingHumanization(context: BrowserContext): Promise<void> {
    await context.addInitScript(
      humanizeFetchTiming(StealthSession.MIN_FETCH_DELAY_MS, StealthSession.MAX_FETCH_DELAY_MS)
    );
  }
}
