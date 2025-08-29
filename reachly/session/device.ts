import type { Query } from "#foxbot/core";

/**
 * Device characteristics exposed to scripts.
 */
export interface Device {
  platform(): Promise<string>;
  deviceMemory(): Promise<number>;
  hardwareConcurrency(): Promise<number>;
}

/**
 * Device implementation backed by JSON string query.
 */
export class JsonDevice implements Device {
  constructor(private readonly json: Query<string>) {}
  async platform(): Promise<string> {
    return JSON.parse(await this.json.value()).platform;
  }
  async deviceMemory(): Promise<number> {
    return JSON.parse(await this.json.value()).deviceMemory;
  }
  async hardwareConcurrency(): Promise<number> {
    return JSON.parse(await this.json.value()).hardwareConcurrency;
  }
}
