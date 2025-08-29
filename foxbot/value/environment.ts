import { Query } from "#foxbot/core";

/**
 * A query that retrieves an environment variable value.
 *
 * @example
 * ```typescript
 * const env = new Environment("NODE_ENV");
 * const value = await env.value(); // returns environment variable value
 * ```
 */
export class Environment implements Query<string> {
  /**
   * Creates a new environment variable query.
   *
   * @param variable The environment variable name to read
   */
  constructor(private readonly variable: string) {}

  /**
   * Retrieves the environment variable value.
   *
   * @returns Promise that resolves to the environment variable value
   * @throws Error if environment variable is not found
   */
  async value(): Promise<string> {
    const value = process.env[this.variable];
    if (!value) {
      throw new Error(`Environment variable ${this.variable} is not defined`);
    }
    return value;
  }
}
