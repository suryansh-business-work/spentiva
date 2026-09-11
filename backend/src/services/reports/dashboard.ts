import { Transaction } from '../../models/Transaction.js';
import type { UserDoc } from '../../models/User.js';
import { formatMoney } from '../../utils/money.js';
import { dayKeys, dayLabel, elapsedDays, lastDaysRange, previousRange } from '../../utils/time.js';
import { round2 } from '../../utils/validators.js';
import { buildReport } from './build.js';
import { categoryRows, pct, resolveRange, totalsByType } from './queries.js';

interface InsightInput {
  user: UserDoc;
  count: number;
  expenseChange: number | null;
  top: { name: string; percent: number } | undefined;
  daysLeft: number;
  remaining: number;
  hasBudget: boolean;
}

/** Up to two short, human sentences about the period */
function insights({ user, count, expenseChange, top, daysLeft, remaining, hasBudget }: InsightInput): string {
  const money = (n: number) => formatMoney(n, user.currency, user.locale, 0);
  const lines: string[] = [];
  if (count === 0) lines.push('No entries yet — tell the chat “spent 250 on lunch” to log your first expense.');
  if (expenseChange !== null) {
    const direction = expenseChange <= 0 ? 'less' : 'more';
    lines.push(`You spent ${Math.abs(Math.round(expenseChange))}% ${direction} than last period.`);
  }
  if (top) lines.push(`Most of it went to ${top.name} (${Math.round(top.percent)}%).`);
  if (daysLeft > 0 && remaining > 0) lines.push(`${daysLeft} days left — about ${money(remaining / daysLeft)} per day to stay on track.`);
  if (daysLeft > 0 && remaining < 0) lines.push(`You're ${money(-remaining)} over ${hasBudget ? 'budget' : 'income'} this period.`);
  return lines.slice(0, 2).join(' ');
}

function daysLeftIn(range: { from: Date; to: Date }, now: number): number {
  const running = now >= range.from.getTime() && now < range.to.getTime();
  return running ? Math.ceil((range.to.getTime() - now) / 86_400_000) : 0;
}

export async function buildDashboard(user: UserDoc, opts: { month?: string | null; from?: Date | null; to?: Date | null } = {}) {
  const tz = user.timezone;
  const range = resolveRange(user, { kind: 'CATEGORY', period: 'THIS_MONTH', ...opts });
  const now = Date.now();
  // Last 7 days of the period (like the weekly bars in the design)
  const trendRange = lastDaysRange(7, tz, new Date(Math.min(range.to.getTime(), now + 1)));

  const [totals, prevTotals, slicesRaw, recent, trend] = await Promise.all([
    totalsByType(user, range),
    totalsByType(user, previousRange(range, tz)),
    categoryRows(user, range, 'EXPENSE'),
    Transaction.find({ userId: user._id }).sort({ occurredAt: -1 }).limit(6),
    buildReport(user, { kind: 'DAILY', from: trendRange.from, to: trendRange.to }),
  ]);
  trend.labels = dayKeys(trendRange, tz).map((k) => dayLabel(k, 'EEE'));

  const { income, expense } = totals;
  const budget = user.monthlyBudget ?? null;
  const remaining = (budget ?? income) - expense;
  const daysLeft = daysLeftIn(range, now);
  const slices = slicesRaw.map((s) => ({ ...s, percent: round2(pct(s.amount, expense)) }));
  const expenseChange = prevTotals.expense > 0 ? round2(pct(expense - prevTotals.expense, prevTotals.expense)) : null;

  return {
    from: range.from,
    to: range.to,
    currency: user.currency,
    income: round2(income),
    expense: round2(expense),
    savings: round2(income - expense),
    savingsRate: round2(pct(income - expense, income)),
    expenseRatio: round2(pct(expense, income)),
    budget,
    remaining: round2(remaining),
    daysLeft,
    dailyAllowance: daysLeft > 0 ? round2(Math.max(0, remaining) / daysLeft) : 0,
    avgDailyExpense: round2(expense / Math.max(1, elapsedDays(range))),
    transactionCount: totals.count,
    previousExpense: round2(prevTotals.expense),
    expenseChange,
    topCategory: slices[0] ?? null,
    categories: slices,
    trend,
    recent,
    insight: insights({ user, count: totals.count, expenseChange, top: slices[0], daysLeft, remaining, hasBudget: budget !== null }),
  };
}
