import { Query } from "../core";

/**
 * A query that provides a fallback text value if the primary query fails.
 *
 * @example
 * ```typescript
 * const primary = new TextOf(element);
 * const fallback = new TextLiteral("Default text");
 * const safe = new SafeText(primary, fallback);
 * const result = await safe.value(); // returns primary text or fallback if error
 * ```
 */
export class SafeText implements Query<string> {
  /**
   * Creates a new safe text query.
   *
   * @param t The primary text query to try first
   * @param f The fallback text query to use if primary fails
   */
  constructor(
    private readonly t: Query<string>,
    private readonly f: Query<string>
  ) {}

  /**
   * Attempts to get text from primary query, falls back to secondary if it fails.
   *
   * @returns Promise that resolves to the primary text or fallback text if primary fails
   */
  async value(): Promise<string> {
    try {
      return await this.t.value();
    } catch {
      return await this.f.value();
    }
  }
}
