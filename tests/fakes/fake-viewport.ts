import type { Viewport } from "#reachly/session/viewport";

/**
 * Fake viewport returning fixed dimensions for tests
 */
export class FakeViewport implements Viewport {
  constructor(
    private readonly wide: number,
    private readonly high: number,
    private readonly bar: number
  ) {}
  async width(): Promise<number> {
    return this.wide;
  }
  async height(): Promise<number> {
    return this.high;
  }
  async screenWidth(): Promise<number> {
    return this.wide;
  }
  async screenHeight(): Promise<number> {
    return this.high;
  }
  async devicePixelRatio(): Promise<number> {
    return 1;
  }
  async taskbarHeight(): Promise<number> {
    return this.bar;
  }
}
