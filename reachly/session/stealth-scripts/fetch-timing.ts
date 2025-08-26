/**
 * Adds human-like delays to fetch requests.
 */
export function humanizeFetchTiming(minDelayMs: number, maxDelayMs: number): string {
  return `
    const originalFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      const humanDelay = Math.random() * (${maxDelayMs} - ${minDelayMs}) + ${minDelayMs};
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(originalFetch(input, init));
        }, humanDelay);
      });
    };
  `;
}
