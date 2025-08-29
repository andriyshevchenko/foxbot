import type { Query } from "#foxbot/core";

/**
 * Fake headless query implementation for testing purposes.
 * Returns a fixed boolean value for browser headless configuration.
 *
 * @example
 * ```typescript
 * const headless = new FakeHeadless(true);
 * const isHeadless = await headless.value(); // returns true
 * ```
 */
export class FakeHeadless implements Query<boolean> {
  /**
   * Creates a new fake headless query.
   *
   * @param returnValue Boolean value to return when queried
   */
  constructor(private readonly returnValue: boolean) {}

  /**
   * Returns the configured boolean value.
   *
   * @returns Promise resolving to configured boolean value
   */
  async value(): Promise<boolean> {
    return this.returnValue;
  }
}

/**
 * Fake args query implementation for testing purposes.
 * Returns a fixed string value for browser arguments configuration.
 *
 * @example
 * ```typescript
 * const args = new FakeArgs("--no-sandbox");
 * const argsValue = await args.value(); // returns "--no-sandbox"
 * ```
 */
export class FakeArgs implements Query<string> {
  /**
   * Creates a new fake args query.
   *
   * @param returnValue String value to return when queried
   */
  constructor(private readonly returnValue: string) {}

  /**
   * Returns the configured string value.
   *
   * @returns Promise resolving to configured string value
   */
  async value(): Promise<string> {
    return this.returnValue;
  }
}
