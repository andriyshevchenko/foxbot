import { Query } from "#foxbot/core";

/**
 * A query that retrieves a base64-encoded environment variable and decodes it.
 *
 * @example
 * ```typescript
 * const username = new EnvironmentBase64("LINKEDIN_USERNAME");
 * const value = await username.value(); // returns decoded string
 * ```
 */
export class EnvironmentBase64 implements Query<string> {
  /**
   * Creates a new environment base64 query.
   *
   * @param variable The environment variable name to read
   */
  constructor(private readonly variable: string) {}

  /**
   * Retrieves and decodes the base64-encoded environment variable.
   *
   * @returns Promise that resolves to the decoded string value
   * @throws Error if environment variable is not found or invalid base64
   */
  async value(): Promise<string> {
    const encoded = process.env[this.variable];
    if (!encoded) {
      throw new Error(`Environment variable ${this.variable} is not defined`);
    }
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
      throw new Error(`Environment variable ${this.variable} contains invalid base64 encoding`);
    }
    return Buffer.from(encoded, "base64").toString("utf-8");
  }
}
