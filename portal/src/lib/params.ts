import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

/** Reading / writing filter values in the URL (see useTableState) */

export const text = (p: URLSearchParams, key: string) => p.get(key) ?? '';

/** A value from a fixed set, or '' */
export function oneOf<V extends string>(p: URLSearchParams, key: string, allowed: readonly V[]): V | '' {
  const v = p.get(key);
  return allowed.find((a) => a === v) ?? '';
}

/** Comma separated values from a fixed set */
export function listOf<V extends string>(p: URLSearchParams, key: string, allowed: readonly V[]): V[] {
  const values = new Set(p.get(key)?.split(',') ?? []);
  return allowed.filter((a) => values.has(a));
}

/** yyyy-MM-dd → local calendar Date (what the date pickers work with) */
export function day(p: URLSearchParams, key: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.get(key) ?? '');
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export const dayParam = (d: Date | null) => (d ? format(d, 'yyyy-MM-dd') : null);

/** Start / end of a calendar day in the admin's time zone, as an ISO instant for the API */
export const startOfDayIn = (d: Date, tz: string) => new TZDate(d.getFullYear(), d.getMonth(), d.getDate(), tz).toISOString();
export const endOfDayIn = (d: Date, tz: string) => new TZDate(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999, tz).toISOString();
