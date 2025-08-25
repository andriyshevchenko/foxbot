/**
 * Tracks mouse movements to simulate human-like behavior.
 */
export function trackMouseMovements(maxMouseEvents: number): string {
  return `
    let mouseEvents: Array<{ x: number; y: number; timestamp: number }> = [];
    document.addEventListener("mousemove", (event) => {
      mouseEvents.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      });
      if (mouseEvents.length > ${maxMouseEvents}) {
        mouseEvents = mouseEvents.slice(-${maxMouseEvents});
      }
    });
  `;
}
