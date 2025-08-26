import type { Query } from "../../foxbot/core";

/**
 * Graphics adapter characteristics (WebGL).
 */
export interface Graphics {
  webglVendor(): Promise<string>;
  webglRenderer(): Promise<string>;
}

/**
 * Graphics implementation backed by JSON string query.
 */
export class JsonGraphics implements Graphics {
  constructor(private readonly json: Query<string>) {}
  async webglVendor(): Promise<string> {
    return JSON.parse(await this.json.value()).webglVendor;
  }
  async webglRenderer(): Promise<string> {
    return JSON.parse(await this.json.value()).webglRenderer;
  }
}
