/* c8 ignore file */
/**
 * Represents a query that can retrieve a value of type T asynchronously.
 *
 * @template T The type of value this query returns
 * @example
 * ```typescript
 * class NumberQuery implements Query<number> {
 *   async value(): Promise<number> {
 *     return 42;
 *   }
 * }
 * ```
 */
export interface Query<T> {
  /**
   * Retrieves the value asynchronously.
   *
   * @returns Promise that resolves to the queried value
   */
  value(): Promise<T>;
}
