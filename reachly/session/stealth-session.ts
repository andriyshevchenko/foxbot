import type { BrowserContext } from "playwright";
import type { Session } from "#foxbot/session";
import type { Device } from "./device";
import type { Graphics } from "./graphics";
import type { Host } from "./host";
import type { Location } from "./location";
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
} from "./stealth-scripts";
import type { Viewport } from "./viewport";
import { ConstantFetchTiming } from "./fetch-timing";
import { ConstantJitter } from "./jitter";
import { ConstantMouse } from "./mouse";
import { ConstantPlugins } from "./plugins";

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

    // Inject each stealth script separately for better modularity
    await this.injectWebDriverRemoval(context);
    await this.injectCdcRemoval(context);
    await this.injectChromeRuntimeSpoof(context);
    await this.injectPermissionsApiSpoof(context);
    await this.injectNavigatorPluginsSpoof(context);
    await this.injectNavigatorLanguagesSpoof(context);
    await this.injectDevicePropertiesSpoof(context);
    await this.injectScreenPropertiesSpoof(context);
    await this.injectWebGLContextSpoof(context);
    await this.injectMouseTracking(context);
    await this.injectBoundingRectJitter(context);
    await this.injectFetchTimingHumanization(context);
    return context;
  }

  private async injectWebDriverRemoval(context: BrowserContext): Promise<void> {
    const s = await new WebDriverRemoval().value();
    await context.addInitScript(s);
  }

  private async injectCdcRemoval(context: BrowserContext): Promise<void> {
    const s = await new CdcRemoval().value();
    await context.addInitScript(s);
  }

  private async injectChromeRuntimeSpoof(context: BrowserContext): Promise<void> {
    const s = await new ChromeRuntime().value();
    await context.addInitScript(s);
  }

  private async injectPermissionsApiSpoof(context: BrowserContext): Promise<void> {
    const s = await new PermissionsApi().value();
    await context.addInitScript(s);
  }

  private async injectNavigatorPluginsSpoof(context: BrowserContext): Promise<void> {
    const length = await new ConstantPlugins(StealthSession.PLUGIN_LENGTH).length();
    const s = await new NavigatorPlugins(length).value();
    await context.addInitScript(s);
  }

  private async injectNavigatorLanguagesSpoof(context: BrowserContext): Promise<void> {
    const locale = await this.hostConfig.locale();
    const s = await new NavigatorLanguages(locale).value();
    await context.addInitScript(s);
  }

  private async injectDevicePropertiesSpoof(context: BrowserContext): Promise<void> {
    const platform = await this.device.platform();
    const deviceMemory = await this.device.deviceMemory();
    const hardwareConcurrency = await this.device.hardwareConcurrency();
    const s = await new DeviceProperties({
      platform,
      deviceMemory,
      hardwareConcurrency,
    }).value();
    await context.addInitScript(s);
  }

  private async injectScreenPropertiesSpoof(context: BrowserContext): Promise<void> {
    const width = await this.viewport.screenWidth();
    const height = await this.viewport.screenHeight();
    const taskbar = await this.viewport.taskbarHeight();
    const s = await new ScreenProperties({ width, height, taskbar }).value();
    await context.addInitScript(s);
  }

  private async injectWebGLContextSpoof(context: BrowserContext): Promise<void> {
    const vendor = await this.graphics.webglVendor();
    const renderer = await this.graphics.webglRenderer();
    const s = await new WebGLContext({ vendor, renderer }).value();
    await context.addInitScript(s);
  }

  private async injectMouseTracking(context: BrowserContext): Promise<void> {
    const maxEvents = await new ConstantMouse(StealthSession.MAX_MOUSE_EVENTS).maxEvents();
    const s = await new MouseTracking(maxEvents).value();
    await context.addInitScript(s);
  }

  private async injectBoundingRectJitter(context: BrowserContext): Promise<void> {
    const jitter = new ConstantJitter(
      StealthSession.BOUNDING_RECT_JITTER_AMOUNT,
      StealthSession.JITTER_OFFSET
    );
    const amount = await jitter.amount();
    const offset = await jitter.offset();
    const s = await new BoundingRectJitter({ amount, offset }).value();
    await context.addInitScript(s);
  }

  private async injectFetchTimingHumanization(context: BrowserContext): Promise<void> {
    const timing = new ConstantFetchTiming(
      StealthSession.MIN_FETCH_DELAY_MS,
      StealthSession.MAX_FETCH_DELAY_MS
    );
    const minDelayMs = await timing.minDelayMs();
    const maxDelayMs = await timing.maxDelayMs();
    const s = await new FetchTiming({ minDelayMs, maxDelayMs }).value();
    await context.addInitScript(s);
  }
}
