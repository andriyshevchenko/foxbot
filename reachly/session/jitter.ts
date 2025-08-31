/**
 * Jitter configuration for bounding rectangle calculations.
 */
export interface Jitter {
  amount(): Promise<number>;
  offset(): Promise<number>;
}

/**
 * Jitter configuration backed by constant values.
 */
export class ConstantJitter implements Jitter {
  constructor(
    private readonly amt: number,
    private readonly off: number
  ) {}
  async amount(): Promise<number> {
    return this.amt;
  }
  async offset(): Promise<number> {
    return this.off;
  }
}
