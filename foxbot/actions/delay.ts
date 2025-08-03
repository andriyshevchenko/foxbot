import { Action } from "../core";
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
export class Delay implements Action {
  constructor(
    private readonly s: number,
    private readonly a: Action
  ) {}
  async perform() {
    await sleep(this.s * 1000);
    await this.a.perform();
  }
}
