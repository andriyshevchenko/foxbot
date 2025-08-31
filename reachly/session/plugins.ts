/**
 * Navigator plugins configuration.
 */
export interface Plugins {
  length(): Promise<number>;
}

/**
 * Plugins implementation backed by a constant value.
 */
export class ConstantPlugins implements Plugins {
  constructor(private readonly pluginLength: number) {}
  async length(): Promise<number> {
    return this.pluginLength;
  }
}
