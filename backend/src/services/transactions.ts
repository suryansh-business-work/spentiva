import type { Types } from 'mongoose';
import { Category } from '../models/Category.js';
import { PaymentSource } from '../models/PaymentSource.js';
import type { TrackerDoc } from '../models/Tracker.js';
import { Transaction, type TransactionDoc } from '../models/Transaction.js';
import type { UserDoc } from '../models/User.js';
import { badInput, notFound } from '../utils/errors.js';
import { round2 } from '../utils/validators.js';
import { getRate } from './fx.js';

export interface TxInput {
  type: 'EXPENSE' | 'INCOME';
  amount: number;
  currency?: string | null;
  categoryId: string;
  expenseOnId?: string | null;
  sourceId?: string | null;
  note?: string | null;
  occurredAt?: Date | null;
}

async function resolveFields(tracker: TrackerDoc, input: TxInput) {
  const category = await Category.findOne({ _id: input.categoryId, trackerId: tracker._id });
  if (!category) throw notFound('Category');
  if (category.type !== input.type) {
    throw badInput(`"${category.name}" is an ${category.type.toLowerCase()} category`);
  }
  const expenseOn = input.expenseOnId ? category.items.id(input.expenseOnId) : null;
  if (input.expenseOnId && !expenseOn) throw notFound('Expense On item');

  const source = input.sourceId ? await PaymentSource.findOne({ _id: input.sourceId, trackerId: tracker._id }) : null;
  if (input.sourceId && !source) throw notFound('Payment source');

  const currency = (input.currency || tracker.currency).toUpperCase();
  const fxRate = await getRate(currency, tracker.currency);
  const amount = round2(input.amount);

  return {
    type: input.type,
    amount,
    currency,
    fxRate,
    amountBase: round2(amount * fxRate),
    baseCurrency: tracker.currency,
    categoryId: category._id,
    categoryName: category.name,
    expenseOnId: expenseOn?._id ?? null,
    expenseOnName: expenseOn?.name ?? null,
    sourceId: source?._id ?? null,
    sourceName: source?.name ?? null,
    note: input.note?.trim() || null,
  };
}

export async function createTransaction(user: UserDoc, tracker: TrackerDoc, input: TxInput, via: 'CHAT' | 'MANUAL' = 'MANUAL') {
  const fields = await resolveFields(tracker, input);
  return Transaction.create({
    ...fields,
    trackerId: tracker._id,
    userId: user._id,
    userName: user.name,
    occurredAt: input.occurredAt ?? new Date(),
    via,
  });
}

export async function updateTransaction(tx: TransactionDoc, tracker: TrackerDoc, input: TxInput) {
  tx.set({ ...(await resolveFields(tracker, input)), occurredAt: input.occurredAt ?? tx.occurredAt });
  await tx.save();
  return tx;
}

/** Re-express every entry of a tracker in its new base currency (uses today's rates) */
export async function rebaseTransactions(trackerId: Types.ObjectId, newCurrency: string) {
  const currencies: string[] = await Transaction.distinct('currency', { trackerId });
  for (const currency of currencies) {
    const rate = await getRate(currency, newCurrency);
    await Transaction.updateMany(
      { trackerId, currency },
      [
        {
          $set: {
            fxRate: rate,
            baseCurrency: newCurrency,
            amountBase: { $round: [{ $multiply: ['$amount', rate] }, 2] },
          },
        },
      ],
      { updatePipeline: true },
    );
  }
}
