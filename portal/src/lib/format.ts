import { formatDistanceToNowStrict } from 'date-fns';

/** The admin's own preferences (Settings → Display) drive every date and number in the portal */
export interface Display {
  locale: string;
  timezone: string;
}

const DATE_STYLES = {
  dateTime: { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' },
  dateTimeSeconds: { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' },
  date: { day: 'numeric', month: 'short', year: 'numeric' },
  dayMonth: { day: 'numeric', month: 'short' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;
export type DateStyle = keyof typeof DATE_STYLES;

const formats = new Map<string, Intl.DateTimeFormat>();
function dateFormat(locale: string, timeZone: string, style: DateStyle): Intl.DateTimeFormat {
  const key = `${locale}|${timeZone}|${style}`;
  let f = formats.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...DATE_STYLES[style], timeZone });
    formats.set(key, f);
  }
  return f;
}

/** An ISO instant in the admin's locale + time zone */
export const formatDate = (iso: string, d: Display, style: DateStyle = 'dateTime') => dateFormat(d.locale, d.timezone, style).format(new Date(iso));

/** "5 minutes ago" */
export const timeAgo = (iso: string) => formatDistanceToNowStrict(new Date(iso), { addSuffix: true });

/** A yyyy-MM-dd day key (already in the admin's zone) shown without shifting the day */
export function formatDayKey(key: string, d: Display): string {
  const [y = 1970, m = 1, day = 1] = key.split('-').map(Number);
  return dateFormat(d.locale, 'UTC', 'dayMonth').format(new Date(Date.UTC(y, m - 1, day, 12)));
}

export const formatCount = (n: number, locale: string) => new Intl.NumberFormat(locale).format(n);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
