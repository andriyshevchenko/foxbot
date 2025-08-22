import type { Session } from "../../foxbot/playwright/session";
import type { SessionData } from "./session-data";
import { SessionDecorator } from "./session-decorator";

/**
 * Decorator to inject stealth scripts into a session.
 */
export class StealthSession extends SessionDecorator {
  constructor(
    session: Session,
    private readonly sessionData: SessionData
  ) {
    super(session);
  }

  async open(): Promise<void> {
    await this.session.open();
    await this.injectStealthScripts();
  }

  /**
   * Injects stealth scripts to mask automation indicators and mimic human behavior.
   */
  private async injectStealthScripts(): Promise<void> {
    const context = await this.browser();
    const sessionData = this.sessionData;
    await context.addInitScript((sessionData: SessionData) => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => undefined,
      });
      const windowWithCdc = window as unknown as Record<string, unknown>;
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Array"];
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Promise"];
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Symbol"];
      Object.defineProperty(window, "chrome", {
        get: () => ({
          runtime: {
            onConnect: undefined,
            onMessage: undefined,
          },
        }),
      });
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters: PermissionDescriptor) => {
        if (parameters.name === "notifications") {
          return Promise.resolve({ state: Notification.permission } as PermissionStatus);
        }
        return originalQuery(parameters);
      };
      Object.defineProperty(navigator, "plugins", {
        get: () => [
          {
            0: {
              type: "application/x-google-chrome-pdf",
              suffixes: "pdf",
              description: "Portable Document Format",
              enabledPlugin: null,
            },
            description: "Portable Document Format",
            filename: "internal-pdf-viewer",
            length: 1,
            name: "Chrome PDF Plugin",
          },
        ],
      });
      const localeString = sessionData.locale;
      const localeParts = localeString.split("-");
      Object.defineProperty(navigator, "languages", {
        get: () => [localeString, localeParts[0]],
      });
      if (sessionData.platform) {
        Object.defineProperty(navigator, "platform", {
          get: () => sessionData.platform,
        });
      }
      if (sessionData.deviceMemory) {
        Object.defineProperty(navigator, "deviceMemory", {
          get: () => sessionData.deviceMemory,
        });
      }
      if (sessionData.hardwareConcurrency) {
        Object.defineProperty(navigator, "hardwareConcurrency", {
          get: () => sessionData.hardwareConcurrency,
        });
      }
      if (sessionData.screenWidth && sessionData.screenHeight) {
        Object.defineProperty(screen, "width", {
          get: () => sessionData.screenWidth,
        });
        Object.defineProperty(screen, "height", {
          get: () => sessionData.screenHeight,
        });
        Object.defineProperty(screen, "availWidth", {
          get: () => sessionData.screenWidth,
        });
        const screenHeight = sessionData.screenHeight || sessionData.viewportHeight;
        const taskbarHeight = sessionData.taskbarHeight || 40;
        Object.defineProperty(screen, "availHeight", {
          get: () => screenHeight - taskbarHeight,
        });
      }
      if (sessionData.webglVendor || sessionData.webglRenderer) {
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
            gl.getParameter = function (pname: number) {
              if (pname === gl.VENDOR && sessionData.webglVendor) {
                return sessionData.webglVendor;
              }
              if (pname === gl.RENDERER && sessionData.webglRenderer) {
                return sessionData.webglRenderer;
              }
              return originalGetParameter.call(this, pname);
            };
          }
          return context;
        } as typeof HTMLCanvasElement.prototype.getContext;
      }
      let mouseEvents: Array<{ x: number; y: number; timestamp: number }> = [];
      document.addEventListener("mousemove", (event) => {
        mouseEvents.push({
          x: event.clientX,
          y: event.clientY,
          timestamp: Date.now(),
        });
        if (mouseEvents.length > 50) {
          mouseEvents = mouseEvents.slice(-50);
        }
      });
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        const rect = originalGetBoundingClientRect.call(this);
        const jitterAmount = 0.1;
        const jitter = () => (Math.random() - 0.5) * jitterAmount;
        return {
          ...rect,
          x: rect.x + jitter(),
          y: rect.y + jitter(),
          top: rect.top + jitter(),
          left: rect.left + jitter(),
        };
      };
      const originalFetch = window.fetch;
      window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
        const minDelay = 5;
        const maxDelay = 15;
        const humanDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(originalFetch(input, init));
          }, humanDelay);
        });
      };
    }, sessionData);
  }
}
