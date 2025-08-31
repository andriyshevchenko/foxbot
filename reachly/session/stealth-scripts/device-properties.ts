import type { Query } from "#foxbot/core";

/**
 * Shape for device property spoofing values.
 *
 * @example
 * ```typescript
 * const props: DeviceProps = { platform: "Linux", deviceMemory: 8, hardwareConcurrency: 4 };
 * ```
 */
export interface DeviceProps {
  /** Navigator platform string. */
  readonly platform: string;
  /** Device memory in gigabytes. */
  readonly deviceMemory: number;
  /** Hardware concurrency count. */
  readonly hardwareConcurrency: number;
}

/**
 * Creates a script spoofing navigator device properties.
 */
export class DeviceProperties implements Query<string> {
  constructor(private readonly props: DeviceProps) {}
  async value(): Promise<string> {
    const { platform, deviceMemory, hardwareConcurrency } = this.props;
    const code = `Object.defineProperties(navigator, {
  platform: { get: () => "${platform}" },
  deviceMemory: { get: () => ${deviceMemory} },
  hardwareConcurrency: { get: () => ${hardwareConcurrency} }
});`;
    return code;
  }
}
