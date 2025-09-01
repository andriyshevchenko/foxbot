import type { Host } from "#reachly/session/host";

/**
 * Fake host returning fixed locale for tests
 */
export class FakeHost implements Host {
  constructor(private readonly locale: string) {}
  async userAgent(): Promise<string> {
    return "";
  }
  async locale(): Promise<string> {
    return this.locale;
  }
  async timezone(): Promise<string> {
    return "";
  }
  async headers(): Promise<Record<string, string>> {
    return {};
  }
  async cookies(): Promise<string> {
    return "";
  }
}
