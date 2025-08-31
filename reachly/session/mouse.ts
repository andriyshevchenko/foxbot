/**
 * Mouse tracking configuration.
 */
export interface Mouse {
  maxEvents(): Promise<number>;
}

/**
 * Mouse configuration backed by a constant value.
 */
export class ConstantMouse implements Mouse {
  constructor(private readonly max: number) {}
  async maxEvents(): Promise<number> {
    return this.max;
  }
}
