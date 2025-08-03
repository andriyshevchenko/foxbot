import type { Locator as PwLocator } from "playwright";
import { Query } from "../core";

export class Presence implements Query<boolean> {
  constructor(private readonly locator: Query<PwLocator>) {}
  async value(): Promise<boolean> {
    const loc = await this.locator.value();
    return (await loc.count()) > 0;
  }
}
