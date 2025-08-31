import { Query } from "#foxbot/core";

/**
 * A query that decodes a base64-encoded string.
 *
 * @example
 * ```typescript
 * const encoded = new TextLiteral("SGVsbG8gV29ybGQ=");
 * const decoder = new Base64(encoded);
 * const value = await decoder.value(); // returns "Hello World"
 * ```
 */
export class Base64 implements Query<string> {
  /**
   * Creates a new base64 decoder query.
   *
   * @param encoded Query that returns the base64-encoded string
   */
  constructor(private readonly encoded: Query<string>) {}

  /**
   * Decodes the base64-encoded string.
   *
   * @returns Promise that resolves to the decoded string
   * @throws Error if the input contains invalid base64 encoding
   */
  async value(): Promise<string> {
    const encodedValue = await this.encoded.value();
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encodedValue)) {
      throw new Error("Input contains invalid base64 encoding");
    }
    return Buffer.from(encodedValue, "base64").toString("utf-8");
  }
}
