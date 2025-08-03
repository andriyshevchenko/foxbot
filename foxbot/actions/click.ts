import type { Locator as PwLocator } from "playwright";
import { Action } from "../core";
import { Query } from "../core";

export class Click implements Action {
  constructor(private readonly element: Query<PwLocator>) {}
  async perform(): Promise<void> {
    await (await this.element.value()).click();
  }
}
