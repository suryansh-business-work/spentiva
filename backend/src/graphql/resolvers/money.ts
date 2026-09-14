import type { Types } from 'mongoose';
import type { z } from 'zod';
import { Transaction } from '../../models/Transaction.js';
import { buildDashboard, buildReport } from '../../services/reports/index.js';
import { scopeOf, type Need } from '../../services/trackers/access.js';
import { createTransaction, updateTransaction } from '../../services/transactions.js';
import { notFound, validate } from '../../utils/errors.js';
import { monthRange } from '../../utils/time.js';
import { escapeRegex, zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { RangeZ, ReportZ, TxFilterZ, TxZ } from '../inputs.js';
import { toTransaction } from '../mappers.js';

type Filter = z.infer<typeof TxFilterZ>;
type TrackerArgs = { trackerId?: string | null };

function transactionQuery(trackerId: Types.ObjectId, f: Filter, timezone: string) {
  const q: Record<string, unknown> = { trackerId };
  if (f.type) q.type = f.type;
  if (f.categoryId) q.categoryId = f.categoryId;
  if (f.sourceId) q.sourceId = f.sourceId;
  const month = f.month ? monthRange(f.month, timezone) : null;
  if (month) q.occurredAt = { $gte: month.from, $lt: month.to };
  else if (f.from || f.to) q.occurredAt = { ...(f.from && { $gte: f.from }), ...(f.to && { $lt: f.to }) };
  if (f.search) {
    const rx = new RegExp(escapeRegex(f.search), 'i');
    q.$or = [{ note: rx }, { categoryName: rx }, { expenseOnName: rx }, { sourceName: rx }, { userName: rx }];
  }
  return q;
}

/** An entry plus its tracker, when the user has `need` rights there */
async function entry(ctx: Context, id: string, need: Need) {
  const tx = await Transaction.findById(validate(zObjectId, id));
  if (!tx) throw notFound('Transaction');
  const { tracker } = await ctx.tracker(String(tx.trackerId), need);
  return { tx, tracker };
}

export const moneyResolvers = {
  Query: {
    transactions: async (_: unknown, args: TrackerArgs & { filter?: unknown; limit?: number | null; offset?: number | null }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      const q = transactionQuery(tracker._id, validate(TxFilterZ, args.filter ?? {}), user.timezone);
      const limit = Math.min(Math.max(args.limit ?? 30, 1), 100);
      const offset = Math.max(args.offset ?? 0, 0);
      const [items, total] = await Promise.all([
        Transaction.find(q).sort({ occurredAt: -1, _id: -1 }).skip(offset).limit(limit),
        Transaction.countDocuments(q),
      ]);
      return { items: items.map(toTransaction), total, hasMore: offset + items.length < total };
    },

    transaction: async (_: unknown, { id }: { id: string }, ctx: Context) => toTransaction((await entry(ctx, id, 'VIEW')).tx),

    dashboard: async (_: unknown, args: TrackerArgs & Record<string, unknown>, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      const dashboard = await buildDashboard(scopeOf(tracker, user), validate(RangeZ, args));
      return { ...dashboard, recent: dashboard.recent.map(toTransaction) };
    },

    report: async (_: unknown, args: TrackerArgs & { input: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      return buildReport(scopeOf(tracker, user), validate(ReportZ, args.input));
    },
  },

  Mutation: {
    createTransaction: async (_: unknown, args: TrackerArgs & { input: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'EDIT');
      return toTransaction(await createTransaction(user, tracker, validate(TxZ, args.input), 'MANUAL'));
    },

    updateTransaction: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const { tx, tracker } = await entry(ctx, args.id, 'EDIT');
      return toTransaction(await updateTransaction(tx, tracker, validate(TxZ, args.input)));
    },

    deleteTransaction: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const { tx } = await entry(ctx, id, 'EDIT');
      await tx.deleteOne();
      return true;
    },
  },
};
