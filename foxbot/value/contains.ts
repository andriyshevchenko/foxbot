import { Query } from "../core";

/**
 * A query that checks if one string contains another.
 *
 * @example
 * ```typescript
 * const text = new TextLiteral("hello world");
 * const contains = new Contains(text, new TextLiteral("world"));
 * const result = await contains.value(); // true
 * ```
 */
export class Contains implements Query<boolean> {
  /**
   * Creates a new string containment query.
   *
   * @param haystack Query returning the string to search within
   * @param needle Query returning the string to search for
   */
  constructor(
    private readonly haystack: Query<string>,
    private readonly needle: Query<string>
  ) {}

  /**
   * Determines if the haystack contains the needle.
   *
   * @returns Promise that resolves to true if haystack includes needle
   */
  async value(): Promise<boolean> {
    const [haystackValue, needleValue] = await Promise.all([
      this.haystack.value(),
      this.needle.value(),
    ]);
    return haystackValue.includes(needleValue);
  }
}
