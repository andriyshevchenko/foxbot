/**
 * Network fetch timing configuration.
 */
export interface FetchTiming {
  minDelayMs(): Promise<number>;
  maxDelayMs(): Promise<number>;
}

/**
 * Fetch timing configuration backed by constant values.
 */
export class ConstantFetchTiming implements FetchTiming {
  constructor(
    private readonly min: number,
    private readonly max: number
  ) {}
  async minDelayMs(): Promise<number> {
    return this.min;
  }
  async maxDelayMs(): Promise<number> {
    return this.max;
  }
}
