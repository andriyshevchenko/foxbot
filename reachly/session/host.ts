import type { Query } from "#foxbot/core";

/**
 * Host environment information describing browser-identifying attributes.
 * @example
 * const host: Host = new JsonHost(query)
 * const ua = await host.userAgent()
 */
export interface Host {
  userAgent(): Promise<string>;
  locale(): Promise<string>;
  timezone(): Promise<string>;
  headers(): Promise<Record<string, string>>;
  cookies(): Promise<string>;
}

/**
 * Host implementation backed by JSON string query.
 */
export class JsonHost implements Host {
  constructor(private readonly json: Query<string>) {}
  async userAgent(): Promise<string> {
    return JSON.parse(await this.json.value()).userAgent;
  }
  async locale(): Promise<string> {
    return JSON.parse(await this.json.value()).locale;
  }
  async timezone(): Promise<string> {
    return JSON.parse(await this.json.value()).timezone;
  }
  async headers(): Promise<Record<string, string>> {
    return JSON.parse(await this.json.value()).headers || {};
  }
  async cookies(): Promise<string> {
    return JSON.stringify(JSON.parse(await this.json.value()).cookies);
  }
}
