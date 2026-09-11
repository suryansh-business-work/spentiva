import { TZDate } from '@date-fns/tz';
import {
  addDays,
  addMonths,
  addQuarters,
  differenceInCalendarMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
} from 'date-fns';

export const PERIODS = [
  'TODAY',
  'YESTERDAY',
  'THIS_WEEK',
  'LAST_WEEK',
  'LAST_7_DAYS',
  'THIS_MONTH',
  'LAST_MONTH',
  'LAST_30_DAYS',
  'LAST_90_DAYS',
  'THIS_QUARTER',
  'LAST_QUARTER',
  'LAST_6_MONTHS',
  'LAST_12_MONTHS',
  'THIS_YEAR',
  'LAST_YEAR',
  'ALL_TIME',
] as const;
export type PeriodKey = (typeof PERIODS)[number];

export interface Range {
  from: Date;
  /** exclusive */
  to: Date;
}

const plain = (d: Date) => new Date(d.getTime());

/** Resolve a named period to a [from, to) range in the user's time zone (weeks start Monday, ISO 8601) */
export function periodRange(key: PeriodKey, tz: string, now: Date = new Date()): Range {
  const n = new TZDate(now.getTime(), tz);
  const today = startOfDay(n);
  const week = startOfWeek(n, { weekStartsOn: 1 });
  const month = startOfMonth(n);
  const quarter = startOfQuarter(n);
  const year = startOfYear(n);
  switch (key) {
    case 'TODAY':
      return { from: plain(today), to: plain(addDays(today, 1)) };
    case 'YESTERDAY':
      return { from: plain(subDays(today, 1)), to: plain(today) };
    case 'THIS_WEEK':
      return { from: plain(week), to: plain(addDays(week, 7)) };
    case 'LAST_WEEK':
      return { from: plain(subWeeks(week, 1)), to: plain(week) };
    case 'LAST_7_DAYS':
      return { from: plain(subDays(today, 6)), to: plain(addDays(today, 1)) };
    case 'THIS_MONTH':
      return { from: plain(month), to: plain(addMonths(month, 1)) };
    case 'LAST_MONTH':
      return { from: plain(subMonths(month, 1)), to: plain(month) };
    case 'LAST_30_DAYS':
      return { from: plain(subDays(today, 29)), to: plain(addDays(today, 1)) };
    case 'LAST_90_DAYS':
      return { from: plain(subDays(today, 89)), to: plain(addDays(today, 1)) };
    case 'THIS_QUARTER':
      return { from: plain(quarter), to: plain(addQuarters(quarter, 1)) };
    case 'LAST_QUARTER':
      return { from: plain(subQuarters(quarter, 1)), to: plain(quarter) };
    case 'LAST_6_MONTHS':
      return { from: plain(subMonths(month, 5)), to: plain(addMonths(month, 1)) };
    case 'LAST_12_MONTHS':
      return { from: plain(subMonths(month, 11)), to: plain(addMonths(month, 1)) };
    case 'THIS_YEAR':
      return { from: plain(year), to: plain(addMonths(year, 12)) };
    case 'LAST_YEAR':
      return { from: plain(subYears(year, 1)), to: plain(year) };
    case 'ALL_TIME':
      return { from: new Date(0), to: plain(addDays(today, 1)) };
  }
}

/** A calendar month ("YYYY-MM") in the user's time zone */
export function monthRange(ym: string, tz: string): Range | null {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return null;
  const start = new TZDate(Number(m[1]), Number(m[2]) - 1, 1, tz);
  if (Number.isNaN(start.getTime())) return null;
  return { from: plain(start), to: plain(addMonths(start, 1)) };
}

/** The last `n` whole local days ending with the day that contains `end - 1ms` */
export function lastDaysRange(n: number, tz: string, end: Date): Range {
  const endDay = startOfDay(new TZDate(end.getTime() - 1, tz));
  return { from: plain(subDays(endDay, n - 1)), to: plain(addDays(endDay, 1)) };
}

/** The comparable range right before `range` (the previous month / quarter / year for whole-month ranges) */
export function previousRange(range: Range, tz: string): Range {
  const from = new TZDate(range.from.getTime(), tz);
  const months = differenceInCalendarMonths(new TZDate(range.to.getTime(), tz), from);
  const wholeMonths = months > 0 && from.getTime() === startOfMonth(from).getTime() && addMonths(from, months).getTime() === range.to.getTime();
  if (wholeMonths) return { from: plain(subMonths(from, months)), to: range.from };
  const len = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime() - len), to: range.from };
}

/** Parse a YYYY-MM-DD calendar date in the user's time zone to the start of that day */
export function startOfLocalDate(isoDate: string, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const d = new TZDate(Number(m[1]), Number(m[2]) - 1, Number(m[3]), tz);
  return Number.isNaN(d.getTime()) ? null : plain(d);
}

/** Day keys (yyyy-MM-dd) covering a range in the user's time zone */
export function dayKeys(range: Range, tz: string): string[] {
  const start = new TZDate(range.from.getTime(), tz);
  const end = new TZDate(range.to.getTime() - 1, tz);
  if (end < start) return [];
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
}

/** Month keys (yyyy-MM) covering a range in the user's time zone */
export function monthKeys(range: Range, tz: string): string[] {
  const start = new TZDate(range.from.getTime(), tz);
  const end = new TZDate(range.to.getTime() - 1, tz);
  if (end < start) return [];
  return eachMonthOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM'));
}

/** Human label for a day key, e.g. "Mon 12" */
export function dayLabel(key: string, pattern = 'EEE d'): string {
  const [y, m, d] = key.split('-').map(Number);
  return format(new Date(y!, m! - 1, d!), pattern);
}

/** Human label for a month key, e.g. "Jan 25" */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return format(new Date(y!, m! - 1, 1), 'MMM yy');
}

export function formatRange(range: Range, tz: string): string {
  const a = new TZDate(range.from.getTime(), tz);
  const b = new TZDate(range.to.getTime() - 1, tz);
  if (range.from.getTime() === 0) return `Until ${format(b, 'd MMM yyyy')}`;
  return format(a, 'yyyy-MM-dd') === format(b, 'yyyy-MM-dd')
    ? format(a, 'EEE, d MMM yyyy')
    : `${format(a, 'd MMM yyyy')} – ${format(b, 'd MMM yyyy')}`;
}

/** Whole days in a range, counting only up to "now" for ranges that are still running */
export function elapsedDays(range: Range, now: Date = new Date()): number {
  const end = Math.min(range.to.getTime(), now.getTime());
  const start = range.from.getTime() === 0 ? end - 30 * 86_400_000 : range.from.getTime();
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
}

export function localToday(tz: string): string {
  return format(new TZDate(Date.now(), tz), 'yyyy-MM-dd');
}
