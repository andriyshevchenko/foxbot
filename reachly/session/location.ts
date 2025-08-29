import type { Query } from "#foxbot/core";

/**
 * Geolocation coordinates.
 */
export interface Location {
  latitude(): Promise<number>;
  longitude(): Promise<number>;
}

/**
 * Location implementation backed by JSON string query.
 */
export class JsonLocation implements Location {
  constructor(private readonly json: Query<string>) {}
  async latitude(): Promise<number> {
    return JSON.parse(await this.json.value()).latitude;
  }
  async longitude(): Promise<number> {
    return JSON.parse(await this.json.value()).longitude;
  }
}
