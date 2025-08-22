import { Query } from "../../foxbot/core";

export class Headless implements Query<boolean> {
  constructor() {}

  async value(): Promise<boolean> {
    return process.env["HEADLESS"] === "true";
  }
}
