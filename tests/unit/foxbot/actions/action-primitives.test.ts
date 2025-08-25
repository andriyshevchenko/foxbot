import { describe, expect, it } from "vitest";

import { Fork, NoOp, Sequence } from "../../../../foxbot/actions";
import type { Action } from "../../../../foxbot/core";
import { BooleanLiteral } from "../../../../foxbot/core";

describe("Action primitives", () => {
  it("should execute sequence actions in order", async () => {
    const executionOrder: number[] = [];

    class TestAction implements Action {
      constructor(private order: number) {}
      async perform(): Promise<void> {
        executionOrder.push(this.order);
      }
    }

    const actions = [new TestAction(1), new TestAction(2), new TestAction(3)];

    const sequence = new Sequence(actions);
    await sequence.perform();

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it("should handle no-op actions", async () => {
    const noOp = new NoOp();
    await noOp.perform(); // Should not throw
  });

  it("should execute fork actions based on condition", async () => {
    let thenExecuted = false;
    let elseExecuted = false;

    class ThenAction implements Action {
      async perform(): Promise<void> {
        thenExecuted = true;
      }
    }

    class ElseAction implements Action {
      async perform(): Promise<void> {
        elseExecuted = true;
      }
    }

    const thenAction = new ThenAction();
    const elseAction = new ElseAction();

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
