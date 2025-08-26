/**
 * Removes Chrome DevTools Console (CDC) properties that indicate automation.
 */
export function removeCdcProperties(): string {
  return `
    const windowWithCdc = window as unknown as Record<string, unknown>;
    delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Array"];
    delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Promise"];
    delete windowWithCdc["cdc_adoQpoasnfa76pfcZLmcfl_Symbol"];
  `;
}
