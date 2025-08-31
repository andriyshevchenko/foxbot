import type { Query } from "#foxbot/core";

/**
 * Parameters for WebGL vendor and renderer spoofing.
 *
 * @example
 * ```typescript
 * const p: WebGLProps = { vendor: "Vendor", renderer: "Renderer" };
 * ```
 */
export interface WebGLProps {
  /** Desired WebGL vendor string. */
  readonly vendor: string;
  /** Desired WebGL renderer string. */
  readonly renderer: string;
}

/**
 * Produces script overriding WebGL context parameters.
 */
export class WebGLContext implements Query<string> {
  constructor(private readonly props: WebGLProps) {}
  async value(): Promise<string> {
    const { vendor, renderer } = this.props;
    const code = `const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, ...args) {
  const context = getContext.call(this, type, ...args);
  if (!context) return context;
  const getParam = context.getParameter.bind(context);
  context.getParameter = param => {
    if (param === context.VENDOR) return "${vendor}";
    if (param === context.RENDERER) return "${renderer}";
    return getParam(param);
  };
  return context;
};`;
    return code;
  }
}
