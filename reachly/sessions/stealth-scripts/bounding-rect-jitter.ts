/**
 * Adds jitter to bounding rect calculations to mimic human variance.
 */
export function addBoundingRectJitter(jitterAmount: number, jitterOffset: number): string {
  return `
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      const rect = originalGetBoundingClientRect.call(this);
      const jitter = () => (Math.random() - ${jitterOffset}) * ${jitterAmount};
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
