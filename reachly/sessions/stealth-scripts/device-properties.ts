/**
 * Spoofs device properties like platform, memory, and hardware concurrency.
 */
export function spoofDeviceProperties(): string {
  return `
    if (await sessionData.device.platform()) {
      Object.defineProperty(navigator, "platform", {
        get: async () => await sessionData.device.platform(),
      });
    }
    
    if (await sessionData.device.deviceMemory()) {
      Object.defineProperty(navigator, "deviceMemory", {
        get: async () => await sessionData.device.deviceMemory(),
      });
    }
    
    if (await sessionData.device.hardwareConcurrency()) {
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: async () => await sessionData.device.hardwareConcurrency(),
      });
    }
  `;
}
