import { Query } from "#foxbot/core";
import type { Graphics } from "#reachly/session/graphics";

/**
 * Spoofs WebGL context to return custom vendor and renderer information.
 */
export class WebGLContext implements Query<string> {
  constructor(private readonly graphics: Graphics) {}
  async value(): Promise<string> {
    const vendor = await this.graphics.webglVendor();
    const renderer = await this.graphics.webglRenderer();
    return `
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const context = originalGetContext.call(this, type, ...args);
        if ((type === "webgl" || type === "experimental-webgl") && context) {
          const gl = context;
          const originalGetParameter = gl.getParameter;
          gl.getParameter = function (pname) {
            if (pname === gl.VENDOR) return "${vendor}";
            if (pname === gl.RENDERER) return "${renderer}";
            return originalGetParameter.call(this, pname);
          };
        }
        return context;
      };
    `;
  }
}
