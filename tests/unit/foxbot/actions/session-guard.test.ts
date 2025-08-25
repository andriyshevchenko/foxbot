import { describe, expect, it } from "vitest";
import { SessionGuard } from "../../../../foxbot/actions";
import type { Action } from "../../../../foxbot/core";
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
  it("closes session after target action completes", async () => {
    expect.assertions(1);
    const session = new FakeSession();
    await session.open();
    const guard = new SessionGuard(new SuccessfulAction(), session);
    await guard.perform();
    expect(session.isOpen, "SessionGuard did not close the session").toBe(false);
  });

  it("closes session even when target action throws", async () => {
    expect.assertions(2);
    const session = new FakeSession();
    await session.open();
    const guard = new SessionGuard(new FailingAction(), session);
    await expect(guard.perform()).rejects.toThrow("boom");
    expect(session.isOpen, "SessionGuard did not close the session after error").toBe(false);
  });
});
