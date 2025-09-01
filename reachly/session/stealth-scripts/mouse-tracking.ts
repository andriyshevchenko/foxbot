import { Query } from "#foxbot/core";

/**
 * Tracks mouse movements to simulate human-like behavior.
 */
export class MouseTracking implements Query<string> {
  constructor(private readonly max: Query<number>) {}
  async value(): Promise<string> {
    const max = await this.max.value();
    return `
      let mouseEvents = [];
      document.addEventListener("mousemove", (event) => {
        mouseEvents.push({ x: event.clientX, y: event.clientY, timestamp: Date.now() });
        if (mouseEvents.length > ${max}) {
          mouseEvents = mouseEvents.slice(-${max});
        }
      });
    `;
  }
}
