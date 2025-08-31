import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import type { Device } from "./device";
import type { Graphics } from "./graphics";
import type { Host } from "./host";
import type { Location } from "./location";
import {
  addBoundingRectJitter,
  humanizeFetchTiming,
  removeCdcProperties,
  removeWebDriverProperty,
  spoofChromeRuntime,
  spoofDeviceProperties,
  spoofNavigatorPlugins,
  spoofNavigatorLanguages,
  spoofPermissionsApi,
  spoofScreenProperties,
  spoofWebGLContext,
  trackMouseMovements,
} from "./stealth-scripts";
import type { Viewport } from "./viewport";

/**
 * Decorator to inject stealth scripts into a session.
 */
export class StealthSession implements Session {
  private static readonly PLUGIN_LENGTH = 1;
  private static readonly MAX_MOUSE_EVENTS = 50;
  private static readonly BOUNDING_RECT_JITTER_AMOUNT = 0.1;
  private static readonly JITTER_OFFSET = 0.5;
  private static readonly MIN_FETCH_DELAY_MS = 5;
  private static readonly MAX_FETCH_DELAY_MS = 15;
  private static readonly DEFAULT_TASKBAR_HEIGHT = 40;

  constructor(
    private readonly base: Session,
    private readonly viewport: Viewport,
    private readonly graphics: Graphics,
    private readonly hostConfig: Host,
    private readonly device: Device,
    private readonly location: Location
  ) {}

  async profile(): Promise<BrowserContext> {
    const context = await this.base.profile();
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
    return context;
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
    await context.addInitScript(spoofNavigatorLanguages(), sessionData);
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
    await context.addInitScript(spoofDeviceProperties(), sessionData);
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
    await context.addInitScript(
      spoofScreenProperties(StealthSession.DEFAULT_TASKBAR_HEIGHT),
      sessionData
    );
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
    await context.addInitScript(spoofWebGLContext(), sessionData);
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
