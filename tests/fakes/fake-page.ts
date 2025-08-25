/**
 * Fake page implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const page = new FakePage();
 * await page.goto("https://example.com");
 * ```
 */
export class FakePage {
  private navigatedUrl = "";
  private readonly locators = new Map<string, FakeLocator>();

  goto(url: string): Promise<null> {
    this.navigatedUrl = url;
    return Promise.resolve(null);
  }

  locator(selector: string): FakeLocator {
    if (!this.locators.has(selector)) {
      this.locators.set(selector, new FakeLocator());
    }
    return this.locators.get(selector)!;
  }

  url(): string {
    return this.navigatedUrl;
  }
}

/**
 * Fake locator implementation for testing purposes.
 * Only implements methods actually used in tests to avoid violating type rules.
 */
export class FakeLocator {
  fill(): Promise<void> {
    return Promise.resolve();
  }

  click(): Promise<void> {
    return Promise.resolve();
  }
}
