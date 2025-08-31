import type { Query } from "#foxbot/core";

/**
 * Timing range for humanized fetch delays.
 *
 * @example
 * ```typescript
 * const t: FetchTimingProps = { minDelayMs: 5, maxDelayMs: 15 };
 * ```
 */
export interface FetchTimingProps {
  /** Minimum delay in milliseconds. */
  readonly minDelayMs: number;
  /** Maximum delay in milliseconds. */
  readonly maxDelayMs: number;
}

/**
 * Builds a script that delays fetch requests to mimic humans.
 */
export class FetchTiming implements Query<string> {
  constructor(private readonly props: FetchTimingProps) {}
  async value(): Promise<string> {
    const { minDelayMs, maxDelayMs } = this.props;
    const code = `const originalFetch = fetch.bind(window);
window.fetch = (input, init) => {
  const delay = Math.random() * (${maxDelayMs} - ${minDelayMs}) + ${minDelayMs};
  return new Promise(result => setTimeout(() => result(originalFetch(input, init)), delay));
};`;
    return code;
  }
}
