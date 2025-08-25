import type { Query } from "../../foxbot/core";

/**
 * Viewport and screen dimensions.
 */
export interface Viewport {
  width(): Promise<number>;
  height(): Promise<number>;
  screenWidth(): Promise<number>;
  screenHeight(): Promise<number>;
  devicePixelRatio(): Promise<number>;
  taskbarHeight(): Promise<number>;
}

/**
 * Viewport implementation backed by JSON string query.
 */
export class JsonViewport implements Viewport {
  constructor(private readonly json: Query<string>) {}
  async width(): Promise<number> {
    return JSON.parse(await this.json.value()).viewportWidth;
  }
  async height(): Promise<number> {
    return JSON.parse(await this.json.value()).viewportHeight;
  }
  async screenWidth(): Promise<number> {
    return JSON.parse(await this.json.value()).screenWidth;
  }
  async screenHeight(): Promise<number> {
    return JSON.parse(await this.json.value()).screenHeight;
  }
  async devicePixelRatio(): Promise<number> {
    return JSON.parse(await this.json.value()).devicePixelRatio;
  }
  async taskbarHeight(): Promise<number> {
    return JSON.parse(await this.json.value()).taskbarHeight;
  }
}
