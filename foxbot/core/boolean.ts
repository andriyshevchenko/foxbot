import { Query } from "./query";
export class BooleanLiteral implements Query<boolean> {
  constructor(private readonly b: boolean) {}
  async value() {
    return this.b;
  }
}
