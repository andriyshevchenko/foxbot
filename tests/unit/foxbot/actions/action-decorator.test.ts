import { describe, expect, it } from "vitest";

import { ActionDecorator } from "#foxbot/control";
import type { Action } from "#foxbot/core";

/**
 * Test action implementation that logs execution for verification.
 * Used to verify decorator pattern behavior.
 *
 * @example
 * ```typescript
 * const log: string[] = [];
 * const probe = new ProbeAction(log);
 * await probe.perform(); // adds "performed" to log
 * ```
 */
class ProbeAction implements Action {
  constructor(private readonly log: string[]) {}

  async perform(): Promise<void> {
    this.log.push("performed");
  }
}

/**
 * Test decorator implementation that extends ActionDecorator.
 * Used to verify that ActionDecorator properly forwards calls.
 *
 * @example
 * ```typescript
 * const wrapped = new ProbeAction(log);
 * const decorator = new TestDecorator(wrapped);
 * await decorator.perform(); // forwards to wrapped action
 * ```
 */
class TestDecorator extends ActionDecorator {
  constructor(wrapped: Action) {
    super(wrapped);
  }
}

describe("ActionDecorator", () => {
  it("forwards perform call to wrapped action", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const wrapped = new ProbeAction(log);
    const decorator = new TestDecorator(wrapped);
    await decorator.perform();
    expect(log, "ActionDecorator did not forward perform call to wrapped action").toEqual([
      "performed",
    ]);
  });

  it("can be extended by concrete decorators", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const wrapped = new ProbeAction(log);
    const decorator = new TestDecorator(wrapped);
    expect(decorator, "ActionDecorator cannot be extended by concrete decorators").toBeInstanceOf(
      ActionDecorator
    );
  });

  it("implements Action interface correctly", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const wrapped = new ProbeAction(log);
    const decorator = new TestDecorator(wrapped);
    expect(
      typeof decorator.perform,
      "ActionDecorator does not implement Action interface correctly"
    ).toBe("function");
  });

  it("handles multiple perform calls", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const wrapped = new ProbeAction(log);
    const decorator = new TestDecorator(wrapped);
    await decorator.perform();
    await decorator.perform();
    expect(log, "ActionDecorator did not handle multiple perform calls").toEqual([
      "performed",
      "performed",
    ]);
  });
});
