import { describe, expect, it } from "vitest";

import { SessionDecorator } from "../../../../reachly/sessions/session-decorator";

import { FakeIntegrationSession } from "./index";

/**
 * Test implementation of SessionDecorator for testing abstract functionality.
 * Provides a concrete implementation to test decorator behavior.
 *
 * @example
 * ```typescript
 * const decorator = new TestSessionDecorator(session);
 * await decorator.open();
 * ```
 */
class TestSessionDecorator extends SessionDecorator {
  private opened = false;

  async open(): Promise<void> {
    await this.session.open();
    this.opened = true;
  }

  isOpened(): boolean {
    return this.opened;
  }
}

describe("SessionDecorator", () => {
  it("delegates browser call to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    const context = await decorator.browser();
    await decorator.close();
    expect(
      context,
      "SessionDecorator did not delegate browser call to wrapped session"
    ).toBeDefined();
  });

  it("delegates disposal to wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator.close();
    expect(
      fakeSession.isDisposed(),
      "SessionDecorator did not delegate disposal to wrapped session"
    ).toBe(true);
  });

  it("calls wrapped session open method", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator.open();
    const context = await decorator.browser();
    await decorator.close();
    expect(context, "SessionDecorator did not call wrapped session open method").toBeDefined();
  });

  it("maintains decorator state independently of wrapped session", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    const decorator = new TestSessionDecorator(fakeSession);
    await decorator.open();
    await decorator.close();
    expect(
      decorator.isOpened(),
      "SessionDecorator did not maintain decorator state independently"
    ).toBe(true);
  });

  it("handles wrapped session disposal promise correctly", async () => {
    expect.assertions(1);
    const fakeSession = new FakeIntegrationSession();
    await fakeSession.open();
    const decorator = new TestSessionDecorator(fakeSession);
    const disposePromise = decorator.close();
    await disposePromise;
    expect(
      fakeSession.isDisposed(),
      "SessionDecorator did not handle wrapped session disposal promise correctly"
    ).toBe(true);
  });
});
