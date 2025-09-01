import { Query } from "#foxbot/core";

/**
 * Adds jitter to bounding rect calculations to mimic human variance.
 */
export class BoundingRectJitter implements Query<string> {
  constructor(
    private readonly amount: Query<number>,
    private readonly offset: Query<number>
  ) {}
  async value(): Promise<string> {
    const amount = await this.amount.value();
    const offset = await this.offset.value();
    return `
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        const rect = originalGetBoundingClientRect.call(this);
        const jitter = () => (Math.random() - ${offset}) * ${amount};
        return {
          ...rect,
          x: rect.x + jitter(),
          y: rect.y + jitter(),
          top: rect.top + jitter(),
          left: rect.left + jitter(),
        };
      };
    `;
  }
}
