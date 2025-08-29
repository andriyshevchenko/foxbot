import { describe, expect, it } from "vitest";

import { Fork, NoOp, Sequence, When } from "../../../../foxbot/control";
import type { Action, Query } from "../../../../foxbot/core";
import { BooleanLiteral } from "../../../../foxbot/core";

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
      const executionOrder: number[] = [];
      const actions = [
        new TestAction(executionOrder, 1),
        new TestAction(executionOrder, 2),
        new TestAction(executionOrder, 3),
      ];

      const sequence = new Sequence(actions);
      await sequence.perform();

      expect(executionOrder).toEqual([1, 2, 3]);
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
      const noOp = new NoOp();
      await noOp.perform(); // Should not throw
    });
  });

  describe("Fork", () => {
    it("executes then action when condition is true", async () => {
      expect.assertions(2);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const trueFork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await trueFork.perform();
      expect(log.includes("then"), "Then action was not executed when condition was true").toBe(
        true
      );
      expect(log.includes("else"), "Else action was executed when condition was true").toBe(false);
    });

    it("executes else action when condition is false", async () => {
      expect.assertions(2);
      const log: string[] = [];
      const thenAction = new ProbeAction(log, "then");
      const elseAction = new ProbeAction(log, "else");
      const falseFork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await falseFork.perform();
      expect(log.includes("then"), "Then action was executed when condition was false").toBe(false);
      expect(log.includes("else"), "Else action was not executed when condition was false").toBe(
        true
      );
    });

    it("executes actions based on condition with callbacks", async () => {
      let thenExecuted = false;
      let elseExecuted = false;

      const thenAction = new ThenAction(() => {
        thenExecuted = true;
      });
      const elseAction = new ElseAction(() => {
        elseExecuted = true;
      });

      // Test true condition
      const trueFork = new Fork(new BooleanLiteral(true), thenAction, elseAction);
      await trueFork.perform();

      expect(thenExecuted).toBe(true);
      expect(elseExecuted).toBe(false);

      // Reset and test false condition
      thenExecuted = false;
      elseExecuted = false;

      const falseFork = new Fork(new BooleanLiteral(false), thenAction, elseAction);
      await falseFork.perform();

      expect(thenExecuted).toBe(false);
      expect(elseExecuted).toBe(true);
    });
  });

  // OpenSession removed from public API; session lifecycle derived via profile()
});
