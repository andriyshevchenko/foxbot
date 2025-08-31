import type { Query } from "#foxbot/core";

/**
 * Encodes a script that jitters element bounding rectangles.
 *
 * @example
 * ```typescript
 * const q = new BoundingRectJitter({ amount: 1, offset: 0 });
 * const s = await q.value();
 * ```
 */
export interface JitterProps {
  /** Amount of jitter to apply. */
  readonly amount: number;
  /** Offset baseline for jitter. */
  readonly offset: number;
}

/**
 * Generates bounding rectangle jitter script.
 */
export class BoundingRectJitter implements Query<string> {
  constructor(private readonly props: JitterProps) {}
  async value(): Promise<string> {
    const { amount, offset } = this.props;
    const code = `const base = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function() {
  const rect = base.call(this);
  const jitter = () => (Math.random() - ${offset}) * ${amount};
  return {
    ...rect,
    x: rect.x + jitter(),
    y: rect.y + jitter(),
    top: rect.top + jitter(),
    left: rect.left + jitter()
  };
};`;
    return code;
  }
}
