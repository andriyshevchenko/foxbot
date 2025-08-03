import type { ElementHandle, Locator as PwLocator } from "playwright";
import { Query } from "../core";

export class Element implements Query<ElementHandle<HTMLElement>> {
  constructor(private readonly locator: Query<PwLocator>) {}
  async value(): Promise<ElementHandle<HTMLElement>> {
    const loc = await this.locator.value();
    const handle = await loc.elementHandle();
    if (!handle) throw new Error("Element not found");
    return handle as ElementHandle<HTMLElement>;
  }
}
