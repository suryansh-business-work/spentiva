import { format, isSameDay, subDays, subMonths } from 'date-fns';

export type DateInput = string | number | Date;

/** The user preferences that drive every date / number display (Profile → Preferences) */
export interface DisplaySettings {
  locale: string;
  timezone: string;
}

/** Named display styles, rendered with the user's locale + time zone (no hard-coded patterns) */
export const DATE_STYLES = {
  date: { day: 'numeric', month: 'short', year: 'numeric' },
  dayMonth: { day: 'numeric', month: 'short' },
  dateTime: { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' },
  time: { hour: 'numeric', minute: '2-digit' },
  weekday: { weekday: 'short', day: 'numeric', month: 'short' },
  longDay: { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' },
  month: { month: 'long', year: 'numeric' },
  monthShort: { month: 'short', year: 'numeric' },
  monthName: { month: 'long' },
  monthAbbr: { month: 'short' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;
export type DateStyle = keyof typeof DATE_STYLES;

const dateFormats = new Map<string, Intl.DateTimeFormat>();
function dateFormat(locale: string, timeZone: string, style: DateStyle | 'parts'): Intl.DateTimeFormat {
  const key = `${locale}|${timeZone}|${style}`;
  let f = dateFormats.get(key);
  if (!f) {
    const options: Intl.DateTimeFormatOptions =
      style === 'parts'
        ? { hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
        : DATE_STYLES[style];
    f = new Intl.DateTimeFormat(locale, { ...options, timeZone });
    dateFormats.set(key, f);
  }
  return f;
}

export const formatDate = (input: DateInput, s: DisplaySettings, style: DateStyle) => dateFormat(s.locale, s.timezone, style).format(new Date(input));

/** Wall-clock Date for an instant in an IANA zone, for date-fns calendar math (same day? which month?) */
export function zoned(input: DateInput, timeZone: string): Date {
  const parts: Record<string, number> = {};
  for (const p of dateFormat('en-US', timeZone, 'parts').formatToParts(new Date(input))) {
    if (p.type !== 'literal') parts[p.type] = Number(p.value);
  }
  return new Date(parts.year ?? 1970, (parts.month ?? 1) - 1, parts.day ?? 1, (parts.hour ?? 0) % 24, parts.minute ?? 0, parts.second ?? 0);
}

/** YYYY-MM-DD for an instant in the user's zone */
export const localDateKey = (input: DateInput, timeZone: string) => format(zoned(input, timeZone), 'yyyy-MM-dd');

/** Display a calendar key (YYYY-MM or YYYY-MM-DD) without any time-zone shift */
export function formatKey(key: string, s: DisplaySettings, style: DateStyle): string {
  const [y = 1970, m = 1, d = 15] = key.split('-').map(Number);
  return dateFormat(s.locale, 'UTC', style).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** "Today", "Yesterday" or a short weekday date */
export function dayLabel(iso: string, s: DisplaySettings): string {
  const day = zoned(iso, s.timezone);
  const now = zoned(Date.now(), s.timezone);
  if (isSameDay(day, now)) return 'Today';
  if (isSameDay(day, subDays(now, 1))) return 'Yesterday';
  return formatDate(iso, s, day.getFullYear() === now.getFullYear() ? 'weekday' : 'date');
}

/** YYYY-MM keys for the current month and the `count - 1` months before it */
export function recentMonths(timeZone: string, count = 18): string[] {
  const now = zoned(Date.now(), timeZone);
  return Array.from({ length: count }, (_, i) => format(subMonths(now, i), 'yyyy-MM'));
}

export const currentMonth = (timeZone: string) => format(zoned(Date.now(), timeZone), 'yyyy-MM');

const numberFormats = new Map<string, Intl.NumberFormat>();
function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let f = numberFormats.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, options);
    numberFormats.set(key, f);
  }
  return f;
}

/** ISO 4217 money in the user's locale, e.g. ₹1,234.5 / $12 */
export function money(amount: number, currency: string, locale: string): string {
  const decimals = Math.abs(amount) >= 1000 ? 0 : 2;
  return numberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(amount);
}

export function currencySymbol(currency: string, locale: string): string {
  const parts = numberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
