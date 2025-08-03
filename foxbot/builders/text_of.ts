import type { Locator as PwLocator } from "playwright";
import { Query } from "../core";

export class TextOf implements Query<string> {
  constructor(private readonly locator: Query<PwLocator>) {}
  async value(): Promise<string> {
    const loc = await this.locator.value();
    const txt = await loc.textContent();
    return (txt ?? "").trim();
  }
}
