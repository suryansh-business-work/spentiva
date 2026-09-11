import { Types, type PipelineStage } from 'mongoose';
import { Category } from '../../models/Category.js';
import { Transaction } from '../../models/Transaction.js';
import type { UserDoc } from '../../models/User.js';
import { round2 } from '../../utils/validators.js';
import { periodRange, monthRange, type Range } from '../../utils/time.js';
import { PALETTE, type Dataset, type ReportParams, type Stat, type StatFormat, type TxType } from './types.js';

export const paletteColor = (i: number) => PALETTE[i % PALETTE.length] ?? '#5DA314';
export const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);
export const typeLabel = (type: TxType) => (type === 'INCOME' ? 'Income' : 'Spending');

export const stat = (label: string, value: number, format: StatFormat = 'CURRENCY', hint: string | null = null): Stat => ({
  label,
  value: round2(value),
  format,
  hint,
});

export const dataset = (label: string, data: number[], color: string | null = null, colors: string[] | null = null): Dataset => ({
  label,
  data: data.map(round2),
  color,
  colors,
});

/** Explicit from/to → calendar month → named period (MONTHLY defaults to the last 6 months) */
export function resolveRange(user: UserDoc, p: Pick<ReportParams, 'period' | 'month' | 'from' | 'to' | 'kind'>): Range {
  if (p.from && p.to && p.to > p.from) return { from: p.from, to: p.to };
  const month = p.month ? monthRange(p.month, user.timezone) : null;
  if (month) return month;
  return periodRange(p.period ?? (p.kind === 'MONTHLY' ? 'LAST_6_MONTHS' : 'THIS_MONTH'), user.timezone);
}

export function match(user: UserDoc, range: Range, type?: TxType | null, categoryId?: string | null) {
  const m: Record<string, unknown> = { userId: user._id, occurredAt: { $gte: range.from, $lt: range.to } };
  if (type) m.type = type;
  if (categoryId && Types.ObjectId.isValid(categoryId)) m.categoryId = new Types.ObjectId(categoryId);
  return m;
}

export async function totalsByType(user: UserDoc, range: Range) {
  const rows = await Transaction.aggregate<{ _id: TxType; total: number; count: number }>([
    { $match: match(user, range) },
    { $group: { _id: '$type', total: { $sum: '$amountBase' }, count: { $sum: 1 } } },
  ]);
  const income = rows.find((r) => r._id === 'INCOME');
  const expense = rows.find((r) => r._id === 'EXPENSE');
  return { income: income?.total ?? 0, expense: expense?.total ?? 0, count: (income?.count ?? 0) + (expense?.count ?? 0) };
}

export interface CategorySlice {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string;
  amount: number;
  count: number;
}

/** Totals per category (sorted desc) with the category's colour/icon */
export async function categoryRows(user: UserDoc, range: Range, type: TxType): Promise<CategorySlice[]> {
  const rows = await Transaction.aggregate<{ _id: Types.ObjectId | null; name: string; total: number; count: number }>([
    { $match: match(user, range, type) },
    { $group: { _id: '$categoryId', name: { $last: '$categoryName' }, total: { $sum: '$amountBase' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
  const cats = await Category.find({ _id: { $in: rows.map((r) => r._id).filter(Boolean) } }, { color: 1, icon: 1, name: 1 });
  const byId = new Map(cats.map((c) => [String(c._id), c]));
  return rows.map((r, i) => {
    const c = r._id ? byId.get(String(r._id)) : undefined;
    return {
      categoryId: r._id ? String(r._id) : null,
      name: c?.name ?? r.name,
      color: c?.color ?? paletteColor(i),
      icon: c?.icon ?? 'other',
      amount: round2(r.total),
      count: r.count,
    };
  });
}

/** Totals grouped by a string field (e.g. sourceName / expenseOnName) */
export function groupedBy(user: UserDoc, range: Range, field: string, type: TxType, categoryId?: string | null) {
  return Transaction.aggregate<{ _id: string; total: number; count: number }>([
    { $match: match(user, range, type, categoryId) },
    { $group: { _id: { $ifNull: [`$${field}`, 'Unspecified'] }, total: { $sum: '$amountBase' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
}

/** Day (%Y-%m-%d) or month (%Y-%m) buckets in the user's time zone → lookup(key, type) */
export async function bucketed(user: UserDoc, range: Range, format: '%Y-%m-%d' | '%Y-%m', type?: TxType | null) {
  const pipeline: PipelineStage[] = [
    { $match: match(user, range, type) },
    {
      $group: {
        _id: { key: { $dateToString: { format, date: '$occurredAt', timezone: user.timezone } }, type: '$type' },
        total: { $sum: '$amountBase' },
      },
    },
  ];
  const rows = await Transaction.aggregate<{ _id: { key: string; type: TxType }; total: number }>(pipeline);
  const totals = new Map(rows.map((r) => [`${r._id.key}|${r._id.type}`, r.total]));
  return (key: string, t: TxType) => totals.get(`${key}|${t}`) ?? 0;
}
