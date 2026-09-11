import { getCalendars, getLocales } from 'expo-localization';

/** Device preferences used as signup defaults: ISO 4217 currency, IANA time zone, BCP 47 locale */
export function deviceDefaults() {
  const locale = getLocales()[0];
  return {
    currency: locale?.currencyCode ?? 'INR',
    timezone: getCalendars()[0]?.timeZone ?? 'UTC',
    locale: locale?.languageTag ?? 'en-IN',
  };
}
