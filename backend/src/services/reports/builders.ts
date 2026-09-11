import { Transaction } from '../../models/Transaction.js';
import { dayKeys, dayLabel, elapsedDays, monthKeys, monthLabel } from '../../utils/time.js';
import { bucketed, categoryRows, dataset, groupedBy, match, paletteColor, pct, stat, totalsByType, typeLabel } from './queries.js';
import { EXPENSE_COLOR, INCOME_COLOR, type BuildCtx, type Report, type ReportKind, type TxType } from './types.js';

const lineColor = (t: TxType) => (t === 'INCOME' ? INCOME_COLOR : EXPENSE_COLOR);
const lineName = (t: TxType) => (t === 'INCOME' ? 'Income' : 'Expense');
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

async function byCategory({ user, range, type, base }: BuildCtx): Promise<Report> {
  const rows = await categoryRows(user, range, type);
  return {
    ...base,
    title: `${typeLabel(type)} by category`,
    chartType: 'doughnut',
    labels: rows.map((r) => r.name),
    datasets: [
      dataset(
        typeLabel(type),
        rows.map((r) => r.amount),
        null,
        rows.map((r) => r.color),
      ),
    ],
    stats: [
      stat('Total', sum(rows.map((r) => r.amount))),
      stat('Top category', rows[0]?.amount ?? 0, 'CURRENCY', rows[0]?.name ?? null),
      stat('Categories', rows.length, 'NUMBER'),
      stat('Transactions', sum(rows.map((r) => r.count)), 'NUMBER'),
    ],
    empty: rows.length === 0,
  };
}

function byField(field: 'sourceName' | 'expenseOnName') {
  const isSource = field === 'sourceName';
  return async ({ user, range, type, params, base }: BuildCtx): Promise<Report> => {
    const rows = await groupedBy(user, range, field, type, params.categoryId);
    return {
      ...base,
      title: isSource ? `${typeLabel(type)} by payment mode` : `${typeLabel(type)} by item`,
      chartType: isSource ? 'pie' : 'bar',
      labels: rows.map((r) => r._id),
      datasets: [
        dataset(
          typeLabel(type),
          rows.map((r) => r.total),
          null,
          rows.map((_, i) => paletteColor(i)),
        ),
      ],
      stats: [
        stat('Total', sum(rows.map((r) => r.total))),
        stat(isSource ? 'Most used' : 'Top item', rows[0]?.total ?? 0, 'CURRENCY', rows[0]?._id ?? null),
        stat('Transactions', sum(rows.map((r) => r.count)), 'NUMBER'),
      ],
      empty: rows.length === 0,
    };
  };
}

/** Daily or monthly buckets; both income & expense unless a type was asked for */
function trend(unit: 'day' | 'month') {
  return async ({ user, range, type, params, base }: BuildCtx): Promise<Report> => {
    const keys = unit === 'day' ? dayKeys(range, user.timezone) : monthKeys(range, user.timezone);
    const value = await bucketed(user, range, unit === 'day' ? '%Y-%m-%d' : '%Y-%m', params.type ?? null);
    const types: TxType[] = params.type ? [params.type] : ['INCOME', 'EXPENSE'];
    const datasets = types.map((t) =>
      dataset(
        lineName(t),
        keys.map((k) => value(k, t)),
        lineColor(t),
      ),
    );
    const focus = keys.map((k) => value(k, type));
    const total = sum(focus);
    const maxIdx = focus.indexOf(Math.max(...focus, 0));
    const peakKey = total > 0 ? keys[maxIdx] : undefined;
    const label = (k: string) => (unit === 'month' ? monthLabel(k) : dayLabel(k, keys.length > 14 ? 'd MMM' : 'EEE d'));
    const noun = unit === 'day' ? 'day' : 'month';
    return {
      ...base,
      title: params.type
        ? `${unit === 'day' ? 'Daily' : 'Monthly'} ${typeLabel(type).toLowerCase()}`
        : `${unit === 'day' ? 'Daily' : 'Monthly'} income vs expense`,
      chartType: 'bar',
      labels: keys.map(label),
      datasets,
      stats: [
        stat(`Total ${typeLabel(type).toLowerCase()}`, total),
        stat(`Average / ${noun}`, total / Math.max(1, unit === 'day' ? elapsedDays(range) : keys.length)),
        stat(`Highest ${noun}`, focus[maxIdx] ?? 0, 'CURRENCY', peakKey ? label(peakKey) : null),
      ],
      empty: datasets.every((d) => d.data.every((v) => v === 0)),
    };
  };
}

async function top({ user, range, type, params, base }: BuildCtx): Promise<Report> {
  const limit = Math.min(Math.max(params.limit ?? 5, 1), 20);
  const rows = (await categoryRows(user, range, type)).slice(0, limit);
  const biggest = await Transaction.findOne(match(user, range, type)).sort({ amountBase: -1 });
  const biggestLabel = biggest ? [biggest.categoryName, biggest.expenseOnName ?? biggest.note].filter(Boolean).join(' · ') : null;
  return {
    ...base,
    title: type === 'INCOME' ? 'Top income sources' : 'Top spending',
    chartType: 'barH',
    labels: rows.map((r) => r.name),
    datasets: [
      dataset(
        typeLabel(type),
        rows.map((r) => r.amount),
        null,
        rows.map((r) => r.color),
      ),
    ],
    stats: [
      stat('Top category', rows[0]?.amount ?? 0, 'CURRENCY', rows[0]?.name ?? null),
      stat('Largest single', biggest?.amountBase ?? 0, 'CURRENCY', biggestLabel),
    ],
    empty: rows.length === 0,
  };
}

/** How many Mondays, Tuesdays … a range covers (up to today) */
function weekdayCounts(keys: string[]): number[] {
  const counts = new Array<number>(7).fill(0);
  for (const k of keys) {
    const [y, m, d] = k.split('-').map(Number);
    const idx = (new Date(y ?? 0, (m ?? 1) - 1, d ?? 1).getDay() + 6) % 7;
    counts[idx] = (counts[idx] ?? 0) + 1;
  }
  return counts;
}

async function average({ user, range, type, params, base }: BuildCtx): Promise<Report> {
  const rows = await Transaction.aggregate<{ _id: number; total: number; count: number }>([
    { $match: match(user, range, type, params.categoryId) },
    { $group: { _id: { $isoDayOfWeek: { date: '$occurredAt', timezone: user.timezone } }, total: { $sum: '$amountBase' }, count: { $sum: 1 } } },
  ]);
  const counts = weekdayCounts(dayKeys({ from: range.from, to: new Date(Math.min(range.to.getTime(), Date.now() + 1)) }, user.timezone));
  const perWeekday = WEEKDAYS.map((_, i) => (rows.find((r) => r._id === i + 1)?.total ?? 0) / Math.max(1, counts[i] ?? 0));
  const total = sum(rows.map((r) => r.total));
  const count = sum(rows.map((r) => r.count));
  const perDay = total / Math.max(1, elapsedDays(range));
  return {
    ...base,
    title: `Average ${typeLabel(type).toLowerCase()}`,
    chartType: 'bar',
    labels: WEEKDAYS,
    datasets: [dataset('Avg per weekday', perWeekday, lineColor(type))],
    stats: [
      stat('Average / day', perDay),
      stat('Average / week', perDay * 7),
      stat('Average / month', perDay * 30.44),
      stat('Average / transaction', count ? total / count : 0),
    ],
    empty: count === 0,
  };
}

async function incomeVsExpense({ user, range, base }: BuildCtx): Promise<Report> {
  const { income, expense } = await totalsByType(user, range);
  const months = monthKeys(range, user.timezone);
  const monthly = months.length > 1;
  const keys = monthly ? months : dayKeys(range, user.timezone);
  const value = await bucketed(user, range, monthly ? '%Y-%m' : '%Y-%m-%d', null);
  return {
    ...base,
    title: 'Income vs expense',
    chartType: 'bar',
    labels: keys.map((k) => (monthly ? monthLabel(k) : dayLabel(k, 'd MMM'))),
    datasets: (['INCOME', 'EXPENSE'] as const).map((t) =>
      dataset(
        lineName(t),
        keys.map((k) => value(k, t)),
        lineColor(t),
      ),
    ),
    stats: [
      stat('Income', income),
      stat('Expense', expense),
      stat('Savings', income - expense),
      stat('Savings rate', pct(income - expense, income), 'PERCENT'),
      stat('Expense / income', pct(expense, income), 'PERCENT'),
    ],
    empty: income === 0 && expense === 0,
  };
}

export const BUILDERS: Record<ReportKind, (ctx: BuildCtx) => Promise<Report>> = {
  CATEGORY: byCategory,
  EXPENSE_ON: byField('expenseOnName'),
  SOURCE: byField('sourceName'),
  DAILY: trend('day'),
  MONTHLY: trend('month'),
  TOP: top,
  AVERAGE: average,
  INCOME_VS_EXPENSE: incomeVsExpense,
};
