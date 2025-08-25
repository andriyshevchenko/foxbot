/**
 * Spoofs WebGL context to return custom vendor and renderer information.
 */
export function spoofWebGLContext(): string {
  return `
    if ((await sessionData.graphics.webglVendor()) || (await sessionData.graphics.webglRenderer())) {
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
  `;
}
