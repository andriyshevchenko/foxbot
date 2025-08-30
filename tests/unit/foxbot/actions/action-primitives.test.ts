import { describe, expect, it } from "vitest";

import { Fork, Lambda, NoOp, Sequence } from "#foxbot/control";
import type { Action } from "#foxbot/core";
import { BooleanLiteral } from "#foxbot/core";

describe("Action primitives", () => {
  it("Sequence executes actions in order", async () => {
    expect.assertions(1);
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
    expect(executionOrder, "Sequence did not execute actions in order").toEqual([1, 2, 3]);
  });

  it("NoOp performs without throwing", async () => {
    expect.assertions(1);
    const noOp = new NoOp();
    await expect(noOp.perform(), "NoOp threw an error").resolves.toBeUndefined();
  });

  it("Lambda executes provided action", async () => {
    expect.assertions(1);
    let executed = false;
    const lambda = new Lambda(async () => {
      executed = true;
    });
    await lambda.perform();
    expect(executed, "Lambda action did not execute provided function").toBe(true);
  });

  it("Fork executes then action when condition is true", async () => {
    expect.assertions(1);
    let thenExecuted = false;
    class ThenAction implements Action {
      async perform(): Promise<void> {
        thenExecuted = true;
      }
    }
    const fork = new Fork(new BooleanLiteral(true), new ThenAction(), new NoOp());
    await fork.perform();
    expect(thenExecuted, "Fork did not execute then action when condition was true").toBe(true);
  });

  it("Fork skips else action when condition is true", async () => {
    expect.assertions(1);
    let elseExecuted = false;
    class ElseAction implements Action {
      async perform(): Promise<void> {
        elseExecuted = true;
      }
    }
    const fork = new Fork(new BooleanLiteral(true), new NoOp(), new ElseAction());
    await fork.perform();
    expect(elseExecuted, "Fork executed else action when condition was true").toBe(false);
  });

  it("Fork executes else action when condition is false", async () => {
    expect.assertions(1);
    let elseExecuted = false;
    class ElseAction implements Action {
      async perform(): Promise<void> {
        elseExecuted = true;
      }
    }
    const fork = new Fork(new BooleanLiteral(false), new NoOp(), new ElseAction());
    await fork.perform();
    expect(elseExecuted, "Fork did not execute else action when condition was false").toBe(true);
  });

  it("Fork skips then action when condition is false", async () => {
    expect.assertions(1);
    let thenExecuted = false;
    class ThenAction implements Action {
      async perform(): Promise<void> {
        thenExecuted = true;
      }
    }
    const fork = new Fork(new BooleanLiteral(false), new ThenAction(), new NoOp());
    await fork.perform();
    expect(thenExecuted, "Fork executed then action when condition was false").toBe(false);
  });
});
