import { z } from 'zod';
import type { LogFilter, LogLevel, LogSource, RulesFieldsFragment } from '@/gql/graphql';
import { LEVEL_LABELS, SOURCE_LABELS, optionsOf } from '@/lib/labels';
import { day, dayParam, endOfDayIn, listOf, oneOf, startOfDayIn, text } from '@/lib/params';

const LEVELS = Object.keys(LEVEL_LABELS) as [LogLevel, ...LogLevel[]];
const SOURCES = Object.keys(SOURCE_LABELS) as [LogSource, ...LogSource[]];
const STATUSES = ['open', 'resolved'] as const;

export const LEVEL_OPTIONS = optionsOf(LEVEL_LABELS);
export const SOURCE_OPTIONS = optionsOf(SOURCE_LABELS);
export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

/** The search limit comes from the API's validationRules */
export const logFiltersSchema = (rules: Pick<RulesFieldsFragment, 'searchMax'>) =>
  z
    .object({
      search: z.string().max(rules.searchMax, `Use at most ${rules.searchMax} characters`),
      levels: z.array(z.enum(LEVELS)),
      source: z.enum(SOURCES).or(z.literal('')),
      status: z.enum(STATUSES).or(z.literal('')),
      from: z.date('Enter a valid date').nullable(),
      to: z.date('Enter a valid date').nullable(),
    })
    .refine((v) => !v.from || !v.to || v.from <= v.to, { path: ['to'], message: 'Must be on or after the start date' });

export type LogFiltersValues = z.infer<ReturnType<typeof logFiltersSchema>>;

export const logFiltersFromParams = (p: URLSearchParams): LogFiltersValues => ({
  search: text(p, 'q'),
  levels: listOf(p, 'levels', LEVELS),
  source: oneOf(p, 'source', SOURCES),
  status: oneOf(p, 'status', STATUSES),
  from: day(p, 'from'),
  to: day(p, 'to'),
});

export const logFiltersToParams = (v: LogFiltersValues) => ({
  q: v.search.trim() || null,
  levels: v.levels.join(',') || null,
  source: v.source || null,
  status: v.status || null,
  from: dayParam(v.from),
  to: dayParam(v.to),
});

/** URL → GraphQL filter. userId / fingerprint / appVersion / platform only come from links. */
export function toLogFilter(p: URLSearchParams, timezone: string): LogFilter {
  const v = logFiltersFromParams(p);
  return {
    search: v.search.trim() || null,
    levels: v.levels.length ? v.levels : null,
    source: v.source || null,
    resolved: v.status ? v.status === 'resolved' : null,
    from: v.from ? startOfDayIn(v.from, timezone) : null,
    to: v.to ? endOfDayIn(v.to, timezone) : null,
    userId: p.get('userId'),
    fingerprint: p.get('fingerprint'),
    appVersion: p.get('appVersion'),
    platform: p.get('platform'),
  };
}
