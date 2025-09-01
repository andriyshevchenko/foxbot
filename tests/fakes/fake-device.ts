import type { Device } from "#reachly/session/device";

/**
 * Fake device returning fixed hardware values for tests
 */
export class FakeDevice implements Device {
  constructor(
    private readonly os: string,
    private readonly memory: number,
    private readonly cores: number
  ) {}
  async platform(): Promise<string> {
    return this.os;
  }
  async deviceMemory(): Promise<number> {
    return this.memory;
  }
  async hardwareConcurrency(): Promise<number> {
    return this.cores;
  }
}
