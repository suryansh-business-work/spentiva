/** ISO 4217 aware currency formatting using the user's BCP 47 locale */
export function formatMoney(amount: number, currency: string, locale: string, maxFractionDigits = 2): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(amount);
}
