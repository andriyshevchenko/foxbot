import type { Device } from "#reachly/session/device";

/**
 * Fake device returning fixed hardware values for tests
 */
export class FakeDevice implements Device {
  constructor(
    private readonly platform: string,
    private readonly memory: number,
    private readonly concurrency: number
  ) {}
  async platform(): Promise<string> {
    return this.platform;
  }
  async deviceMemory(): Promise<number> {
    return this.memory;
  }
  async hardwareConcurrency(): Promise<number> {
    return this.concurrency;
  }
}
