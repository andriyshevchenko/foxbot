import { describe, it, expect } from "vitest";
import type { Action } from "../foxbot/core/action";
import type { Query } from "../foxbot/core/query";
import { When } from "../foxbot/actions/when";
import { Sequence } from "../foxbot/actions/sequence";

class ProbeAction implements Action {
  constructor(
    private readonly log: string[],
    private readonly msg: string
  ) {}
  async perform(): Promise<void> {
    this.log.push(this.msg);
  }
}

describe("actions composition", () => {
  it("Sequence runs in order", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const seq = new Sequence([
      new ProbeAction(log, "a"),
      new ProbeAction(log, "b"),
      new ProbeAction(log, "c"),
    ]);
    await seq.perform();
    expect(log, "Sequence did not execute actions in the expected order").toEqual(["a", "b", "c"]);
  });

  it("When executes inner action only if predicate is true", async () => {
    expect.assertions(1);
    const log: string[] = [];
    const trueQuery: Query<boolean> = { value: async () => true };
    const falseQuery: Query<boolean> = { value: async () => false };
    await new When(trueQuery, new ProbeAction(log, "hit")).perform();
    await new When(falseQuery, new ProbeAction(log, "miss")).perform();
    expect(log, "When did not execute actions based on predicate correctly").toEqual(["hit"]);
  });
});
