import type { Graphics } from "#reachly/session/graphics";

/**
 * Fake graphics returning fixed WebGL info for tests
 */
export class FakeGraphics implements Graphics {
  constructor(
    private readonly vendor: string,
    private readonly renderer: string
  ) {}
  async webglVendor(): Promise<string> {
    return this.vendor;
  }
  async webglRenderer(): Promise<string> {
    return this.renderer;
  }
}
