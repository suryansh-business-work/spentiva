import { Transaction } from '../../models/Transaction.js';
import { buildDashboard, buildReport } from '../../services/reports/index.js';
import { createTransaction, updateTransaction } from '../../services/transactions.js';
import { validate } from '../../utils/errors.js';
import { monthRange } from '../../utils/time.js';
import { escapeRegex, zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { RangeZ, ReportZ, TxFilterZ, TxZ } from '../inputs.js';
import { toTransaction } from '../mappers.js';
import type { z } from 'zod';

type Filter = z.infer<typeof TxFilterZ>;

function transactionQuery(userId: unknown, f: Filter, timezone: string) {
  const q: Record<string, unknown> = { userId };
  if (f.type) q.type = f.type;
  if (f.categoryId) q.categoryId = f.categoryId;
  if (f.sourceId) q.sourceId = f.sourceId;
  const month = f.month ? monthRange(f.month, timezone) : null;
  if (month) q.occurredAt = { $gte: month.from, $lt: month.to };
  else if (f.from || f.to) q.occurredAt = { ...(f.from && { $gte: f.from }), ...(f.to && { $lt: f.to }) };
  if (f.search) {
    const rx = new RegExp(escapeRegex(f.search), 'i');
    q.$or = [{ note: rx }, { categoryName: rx }, { expenseOnName: rx }, { sourceName: rx }];
  }
  return q;
}

export const moneyResolvers = {
  Query: {
    transactions: async (_: unknown, args: { filter?: unknown; limit?: number | null; offset?: number | null }, ctx: Context) => {
      const user = await ctx.user();
      const q = transactionQuery(user._id, validate(TxFilterZ, args.filter ?? {}), user.timezone);
      const limit = Math.min(Math.max(args.limit ?? 30, 1), 100);
      const offset = Math.max(args.offset ?? 0, 0);
      const [items, total] = await Promise.all([
        Transaction.find(q).sort({ occurredAt: -1, _id: -1 }).skip(offset).limit(limit),
        Transaction.countDocuments(q),
      ]);
      return { items: items.map(toTransaction), total, hasMore: offset + items.length < total };
    },

    transaction: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const user = await ctx.user();
      const tx = await Transaction.findOne({ _id: validate(zObjectId, id), userId: user._id });
      return tx ? toTransaction(tx) : null;
    },

    dashboard: async (_: unknown, args: unknown, ctx: Context) => {
      const dashboard = await buildDashboard(await ctx.user(), validate(RangeZ, args));
      return { ...dashboard, recent: dashboard.recent.map(toTransaction) };
    },

    report: async (_: unknown, { input }: { input: unknown }, ctx: Context) => buildReport(await ctx.user(), validate(ReportZ, input)),
  },

  Mutation: {
    createTransaction: async (_: unknown, { input }: { input: unknown }, ctx: Context) =>
      toTransaction(await createTransaction(await ctx.user(), validate(TxZ, input), 'MANUAL')),

    updateTransaction: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) =>
      toTransaction(await updateTransaction(await ctx.user(), validate(zObjectId, args.id), validate(TxZ, args.input))),

    deleteTransaction: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const user = await ctx.user();
      const res = await Transaction.deleteOne({ _id: validate(zObjectId, id), userId: user._id });
      return res.deletedCount === 1;
    },
  },
};
