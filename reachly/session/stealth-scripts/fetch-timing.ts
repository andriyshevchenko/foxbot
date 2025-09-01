import { Query } from "#foxbot/core";

/**
 * Adds human-like delays to fetch requests.
 */
export class FetchTiming implements Query<string> {
  constructor(
    private readonly min: Query<number>,
    private readonly max: Query<number>
  ) {}
  async value(): Promise<string> {
    const min = await this.min.value();
    const max = await this.max.value();
    return `
      const originalFetch = window.fetch;
      window.fetch = function (input, init) {
        const humanDelay = Math.random() * (${max} - ${min}) + ${min};
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(originalFetch(input, init));
          }, humanDelay);
        });
      };
    `;
  }
}
