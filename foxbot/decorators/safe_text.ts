import { Query } from "../core";
export class SafeText implements Query<string> {
  constructor(
    private readonly t: Query<string>,
    private readonly f: Query<string>
  ) {}
  async value() {
    try {
      return await this.t.value();
    } catch {
      return await this.f.value();
    }
  }
}
