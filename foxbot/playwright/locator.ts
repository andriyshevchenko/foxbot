import type { Locator as PwLocator, Page } from "playwright";
import { Query } from "../core";

type HasMaybePage = { page?: Page };

export class Locator implements Query<PwLocator> {
  constructor(
    private readonly ctx: HasMaybePage,
    private readonly selector: string
  ) {}

  async value(): Promise<PwLocator> {
    const page = this.ctx.page;
    if (!page) throw new Error("Session page not started.");
    return page.locator(this.selector);
  }
}
