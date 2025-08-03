import { Action } from "../core";
export class Sequence implements Action {
  constructor(private readonly steps: Action[]) {}
  async perform() {
    for (const s of this.steps) {
      await s.perform();
    }
  }
}
