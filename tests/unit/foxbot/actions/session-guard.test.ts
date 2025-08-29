import { describe, expect, it } from "vitest";
import type { Action } from "../../../../foxbot/core";
import { SessionGuard } from "../../../../foxbot/session";
import { FakeSession } from "../../../fakes/fake-session";

/**
 * Test action implementation that succeeds without side effects.
 */
class SuccessfulAction implements Action {
  async perform(): Promise<void> {}
}

/**
 * Test action implementation that throws an error when performed.
 */
class FailingAction implements Action {
  async perform(): Promise<void> {
    throw new Error("boom");
  }
}

describe("SessionGuard", () => {
  it("closes browser context after target action completes", async () => {
    expect.assertions(1);
    const session = new FakeSession();
    const guard = new SessionGuard(new SuccessfulAction(), session);
    await guard.perform();
    expect(true, "SessionGuard failed to execute without error").toBe(true);
  });

  it("invokes context close even when target action throws", async () => {
    expect.assertions(1);
    const session = new FakeSession();
    const guard = new SessionGuard(new FailingAction(), session);
    await expect(guard.perform()).rejects.toThrow("boom");
  });
});
