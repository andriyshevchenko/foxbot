import { Query } from "./query";
export class NumberLiteral implements Query<number> {
  constructor(private readonly n: number) {}
  async value() {
    return this.n;
  }
}
