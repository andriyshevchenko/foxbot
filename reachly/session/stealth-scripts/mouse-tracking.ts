import type { Query } from "#foxbot/core";

/**
 * Tracks mouse movements in a bounded array.
 *
 * @example
 * ```typescript
 * const q = new MouseTracking(10);
 * const s = await q.value();
 * ```
 */
export class MouseTracking implements Query<string> {
  constructor(private readonly max: number) {}
  async value(): Promise<string> {
    const code = `const events = [];
document.addEventListener("mousemove", event => {
  events.push({ x: event.clientX, y: event.clientY });
  if (events.length > ${this.max}) events.shift();
});
window.__mouseEvents = events;`;
    return code;
  }
}
