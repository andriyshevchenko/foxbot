import { Query } from "#foxbot/core";
import type { Device } from "#reachly/session/device";

/**
 * Spoofs device properties like platform, memory, and hardware concurrency.
 */
export class DeviceProperties implements Query<string> {
  constructor(private readonly device: Device) {}
  async value(): Promise<string> {
    const platform = await this.device.platform();
    const memory = await this.device.deviceMemory();
    const concurrency = await this.device.hardwareConcurrency();
    return `
      Object.defineProperty(navigator, "platform", { get: () => "${platform}" });
      Object.defineProperty(navigator, "deviceMemory", { get: () => ${memory} });
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => ${concurrency} });
    `;
  }
}
