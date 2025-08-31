import type { Query } from "#foxbot/core";

/**
 * Produces a script removing Chrome DevTools exposure properties.
 *
 * @example
 * ```typescript
 * const q = new CdcRemoval();
 * const s = await q.value();
 * ```
 */
export class CdcRemoval implements Query<string> {
  constructor(
    private readonly code: string = `[
  "cdc_adoQpoasnfa76pfcZLmcfl_Array",
  "cdc_adoQpoasnfa76pfcZLmcfl_Promise",
  "cdc_adoQpoasnfa76pfcZLmcfl_Symbol"
].forEach(prop => delete window[prop]);`
  ) {}
  async value(): Promise<string> {
    return this.code;
  }
}
