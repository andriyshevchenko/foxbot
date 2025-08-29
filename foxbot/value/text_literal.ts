import { Query } from "#foxbot/core";

/**
 * A query that returns a string literal value.
 *
 * @example
 * ```typescript
 * const text = new TextLiteral("Hello, World!");
 * const result = await text.value(); // returns "Hello, World!"
 * ```
 */
export class TextLiteral implements Query<string> {
  /**
   * Creates a new text literal query.
   *
   * @param t The string value to return
   */
  constructor(private readonly t: string) {}

  /**
   * Returns the string value.
   *
   * @returns Promise that resolves to the string value
   */
  async value(): Promise<string> {
    return this.t;
  }
}
