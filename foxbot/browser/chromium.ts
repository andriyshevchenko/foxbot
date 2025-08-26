import { chromium } from "playwright";
import type { Browser } from "playwright";

import { Query } from "../core";

export class Chromium implements Query<Browser> {
  constructor(
    private readonly headless: Query<boolean>,
    private readonly args: Query<string>
  ) {}

  async value(): Promise<Browser> {
    return chromium.launch({
      headless: await this.headless.value(),
      args: (await this.args.value()).split(","),
    });
  }
}
