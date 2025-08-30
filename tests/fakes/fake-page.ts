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
  private viewport = { width: 0, height: 0 };
  goto(url: string): Promise<void> {
    this.navigatedUrl = url;
    return Promise.resolve();
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

  setViewport(viewport: { width: number; height: number }): void {
    this.viewport = viewport;
  }

  viewportSize(): { width: number; height: number } {
    return this.viewport;
  }

  close(): Promise<void> {
    return Promise.resolve();
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
