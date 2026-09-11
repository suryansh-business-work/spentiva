import { TZDate } from '@date-fns/tz';
import { format, isSameDay } from 'date-fns';
import type { TrackerDoc } from '../../models/Tracker.js';
import { Transaction } from '../../models/Transaction.js';
import type { UserDoc } from '../../models/User.js';
import { formatRange, monthKeys, monthLabel, periodRange, previousRange, type PeriodKey, type Range } from '../../utils/time.js';
import { round2 } from '../../utils/validators.js';
import { bucketed, categoryRows, groupedBy, paletteColor, pct, totalsByType } from '../reports/queries.js';
import type { ReportScope } from '../reports/types.js';
import { scopeOf } from '../trackers/access.js';

export interface ShareRow {
  name: string;
  color: string;
  amount: number;
  percent: number;
  count: number;
}

export interface MonthRow {
  key: string;
  label: string;
  income: number;
  expense: number;
}

export interface EntryRow {
  id: string;
  when: string;
  title: string;
  detail: string;
  amount: number;
  income: boolean;
}

/** Everything a report email shows, already in the tracker's currency */
export interface ReportEmailData {
  userName: string;
  trackerName: string;
  periodLabel: string;
  rangeLabel: string;
  currency: string;
  locale: string;
  income: number;
  expense: number;
  count: number;
  /** % change in spending vs the previous period (null when there was nothing to compare) */
  expenseChange: number | null;
  /** Monthly budget, only for one-month periods */
  budget: number | null;
  categories: ShareRow[];
  sources: ShareRow[];
  /** Month by month, for periods longer than a month */
  months: MonthRow[];
  /** The day's entries for a one-day period, otherwise the largest expenses */
  entries: EntryRow[];
  entriesAreAll: boolean;
}

const DAY_ENTRIES = 25;
const LARGEST = 5;

/** "Thu, 10 Sep 2026", "September 2026", "Q3 2026", "2026" or a date range */
function describe(range: Range, tz: string) {
  const from = new TZDate(range.from.getTime(), tz);
  const months = monthKeys(range, tz);
  const oneDay = isSameDay(from, new TZDate(range.to.getTime() - 1, tz));
  let label = formatRange(range, tz);
  if (oneDay) label = format(from, 'EEE, d MMM yyyy');
  else if (months.length === 1) label = format(from, 'MMMM yyyy');
  else if (months.length === 3 && from.getMonth() % 3 === 0) label = `Q${from.getMonth() / 3 + 1} ${format(from, 'yyyy')}`;
  else if (months.length === 12 && from.getMonth() === 0) label = format(from, 'yyyy');
  return { label, months, oneDay };
}

const shares = (rows: { name: string; color: string; amount: number; count: number }[], total: number, limit: number): ShareRow[] =>
  rows.slice(0, limit).map((r) => ({ ...r, amount: round2(r.amount), percent: round2(pct(r.amount, total)) }));

async function monthRows(scope: ReportScope, range: Range, keys: string[]): Promise<MonthRow[]> {
  const value = await bucketed(scope, range, '%Y-%m', null);
  const current = format(new TZDate(Date.now(), scope.timezone), 'yyyy-MM');
  return keys
    .filter((key) => key <= current)
    .map((key) => ({ key, label: monthLabel(key), income: round2(value(key, 'INCOME')), expense: round2(value(key, 'EXPENSE')) }));
}

async function entryRows(scope: ReportScope, range: Range, all: boolean, shared: boolean): Promise<EntryRow[]> {
  const q = { trackerId: scope.trackerId, occurredAt: { $gte: range.from, $lt: range.to } };
  const docs = all
    ? await Transaction.find(q).sort({ occurredAt: 1 }).limit(DAY_ENTRIES)
    : await Transaction.find({ ...q, type: 'EXPENSE' })
        .sort({ amountBase: -1 })
        .limit(LARGEST);
  const time: Intl.DateTimeFormatOptions = all ? { hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short' };
  const when = new Intl.DateTimeFormat(scope.locale, { ...time, timeZone: scope.timezone });
  return docs.map((t) => ({
    id: t.id as string,
    when: when.format(t.occurredAt),
    title: [t.categoryName, t.expenseOnName].filter(Boolean).join(' · '),
    detail: [t.note, t.sourceName, shared ? t.userName : null].filter(Boolean).join(' · '),
    amount: t.amountBase,
    income: t.type === 'INCOME',
  }));
}

/** Totals, breakdowns and entries of a tracker for one period, seen with the recipient's zone & locale */
export async function buildReportData(user: UserDoc, tracker: TrackerDoc, period: PeriodKey): Promise<ReportEmailData> {
  const scope = scopeOf(tracker, user);
  const range = periodRange(period, scope.timezone);
  const shape = describe(range, scope.timezone);
  const [totals, previous, categories, sources, months, entries] = await Promise.all([
    totalsByType(scope, range),
    totalsByType(scope, previousRange(range, scope.timezone)),
    categoryRows(scope, range, 'EXPENSE'),
    groupedBy(scope, range, 'sourceName', 'EXPENSE'),
    shape.months.length > 1 ? monthRows(scope, range, shape.months) : Promise.resolve([]),
    entryRows(scope, range, shape.oneDay, tracker.members.length > 0),
  ]);
  const sourceRows = sources.map((s, i) => ({ name: s._id, color: paletteColor(i), amount: s.total, count: s.count }));
  return {
    userName: user.name,
    trackerName: tracker.name,
    periodLabel: shape.label,
    rangeLabel: formatRange(range, scope.timezone),
    currency: scope.currency,
    locale: scope.locale,
    income: round2(totals.income),
    expense: round2(totals.expense),
    count: totals.count,
    expenseChange: previous.expense > 0 ? round2(pct(totals.expense - previous.expense, previous.expense)) : null,
    budget: shape.months.length === 1 && !shape.oneDay ? scope.budget : null,
    categories: shares(categories, totals.expense, 8),
    sources: shares(sourceRows, totals.expense, 6),
    months,
    entries,
    entriesAreAll: shape.oneDay,
  };
}
