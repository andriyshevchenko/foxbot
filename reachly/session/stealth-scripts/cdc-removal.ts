import { Query } from "#foxbot/core";

/**
 * Removes Chrome DevTools Console properties that indicate automation.
 */
export class CdcRemoval implements Query<string> {
  constructor() {}
  async value(): Promise<string> {
    return `
      const windowWithCdc = window;
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Array"];
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Promise"];
      delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Symbol"];
    `;
  }
}
