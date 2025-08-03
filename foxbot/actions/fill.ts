import type { Locator as PwLocator } from "playwright";
import { Action, Query } from "../core";

export class Fill implements Action {
  constructor(
    private readonly element: Query<PwLocator>,
    private readonly text: Query<string>
  ) {}
  async perform(): Promise<void> {
    await (await this.element.value()).fill(await this.text.value());
  }
}
