import { describe, expect, it } from "vitest";

import { Fork, NoOp, Sequence, When } from "#foxbot/control";
import type { Action, Query } from "#foxbot/core";
import { BooleanLiteral } from "#foxbot/core";

// Removed FakeSession usage after OpenSession removal

/**
 * Test action implementation that logs messages for verification.
 * Used to probe action execution order and behavior.
 *
 * @example
 * ```typescript
 * const probe = new ProbeAction(log, "test");
 * await probe.perform(); // adds "test" to log array
 * ```
 */
class ProbeAction implements Action {
  constructor(
    private readonly log: string[],
    private readonly msg: string
  ) {}
  async perform(): Promise<void> {
    this.log.push(this.msg);
  }
}

/**
 * Test action implementation that logs execution order.
 * Used to verify action sequence execution.
 */
class TestAction implements Action {
  constructor(
    private readonly executionOrder: number[],
    private readonly order: number
  ) {}
  async perform(): Promise<void> {
    this.executionOrder.push(this.order);
  }
}

/**
 * Test action for Fork then branch.
 */
class ThenAction implements Action {
  constructor(private readonly callback: () => void) {}
  async perform(): Promise<void> {
    this.callback();
  }
}

/**
 * Test action for Fork else branch.
 */
class ElseAction implements Action {
  constructor(private readonly callback: () => void) {}
  async perform(): Promise<void> {
    this.callback();
  }
}

describe("actions", () => {
  describe("Sequence", () => {
    it("runs actions in order", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const seq = new Sequence([
        new ProbeAction(log, "a"),
        new ProbeAction(log, "b"),
        new ProbeAction(log, "c"),
      ]);
      await seq.perform();
      expect(log, "Sequence did not execute actions in the expected order").toEqual([
        "a",
        "b",
        "c",
      ]);
    });

    it("executes actions in numerical order", async () => {
      expect.assertions(1);
      const executionOrder: number[] = [];
      const actions = [
        new TestAction(executionOrder, 1),
        new TestAction(executionOrder, 2),
        new TestAction(executionOrder, 3),
      ];
      const sequence = new Sequence(actions);
      await sequence.perform();
      expect(executionOrder, "Sequence did not execute actions in numerical order").toEqual([
        1, 2, 3,
      ]);
    });
  });

  describe("When", () => {
    it("executes inner action only if predicate is true", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const predicate: Query<boolean> = { value: async () => true };
      const guard: Query<boolean> = { value: async () => false };
      await new When(predicate, new ProbeAction(log, "hit")).perform();
      await new When(guard, new ProbeAction(log, "miss")).perform();
      expect(log, "When did not execute actions based on predicate correctly").toEqual(["hit"]);
    });
  });

  describe("NoOp", () => {
    it("completes without error", async () => {
      expect.assertions(1);
      const noOp = new NoOp();
      await expect(noOp.perform(), "NoOp threw an error").resolves.toBeUndefined();
    });
  });

  describe("Fork", () => {
    it("executes then action when condition is true", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const fork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await fork.perform();
      expect(log.includes("then"), "Then action was not executed when condition was true").toBe(
        true
      );
    });
    it("skips else action when condition is true", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const fork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await fork.perform();
      expect(log.includes("else"), "Else action was executed when condition was true").toBe(false);
    });

    it("executes else action when condition is false", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const fork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await fork.perform();
      expect(log.includes("else"), "Else action was not executed when condition was false").toBe(
        true
      );
    });
    it("skips then action when condition is false", async () => {
      expect.assertions(1);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const fork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await fork.perform();
      expect(log.includes("then"), "Then action was executed when condition was false").toBe(false);
    });

    it("executes callback in then branch when condition is true", async () => {
      expect.assertions(1);
      let thenExecuted = false;
      const thenAction = new ThenAction(() => {
        thenExecuted = true;
      });
      const elseAction = new ElseAction(() => {});
      const fork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await fork.perform();
      expect(thenExecuted, "Then callback was not executed when condition was true").toBe(true);
    });
    it("skips else callback when condition is true", async () => {
      expect.assertions(1);
      let elseExecuted = false;
      const thenAction = new ThenAction(() => {});
      const elseAction = new ElseAction(() => {
        elseExecuted = true;
      });
      const fork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await fork.perform();
      expect(elseExecuted, "Else callback was executed when condition was true").toBe(false);
    });
    it("executes else callback when condition is false", async () => {
      expect.assertions(1);
      let elseExecuted = false;
      const thenAction = new ThenAction(() => {});
      const elseAction = new ElseAction(() => {
        elseExecuted = true;
      });
      const fork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await fork.perform();
      expect(elseExecuted, "Else callback was not executed when condition was false").toBe(true);
    });
    it("skips then callback when condition is false", async () => {
      expect.assertions(1);
      let thenExecuted = false;
      const thenAction = new ThenAction(() => {
        thenExecuted = true;
      });
      const elseAction = new ElseAction(() => {});
      const fork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await fork.perform();
      expect(thenExecuted, "Then callback was executed when condition was false").toBe(false);
    });
  });

  // OpenSession removed from public API; session lifecycle derived via profile()
});
