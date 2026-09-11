/** ISO 4217 currencies and IANA time zones straight from the runtime's ICU data */
const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

export const CURRENCIES = Intl.supportedValuesOf('currency').map((code) => ({ code, name: currencyNames.of(code) ?? code }));

export const TIME_ZONES = ['UTC', ...Intl.supportedValuesOf('timeZone').filter((z) => z !== 'UTC')];
