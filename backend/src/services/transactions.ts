import type { Types } from 'mongoose';
import { Category } from '../models/Category.js';
import { PaymentSource } from '../models/PaymentSource.js';
import { Transaction } from '../models/Transaction.js';
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

async function resolveFields(user: UserDoc, input: TxInput) {
  const category = await Category.findOne({ _id: input.categoryId, userId: user._id });
  if (!category) throw notFound('Category');
  if (category.type !== input.type) {
    throw badInput(`"${category.name}" is an ${category.type.toLowerCase()} category`);
  }
  const expenseOn = input.expenseOnId ? category.items.id(input.expenseOnId) : null;
  if (input.expenseOnId && !expenseOn) throw notFound('Expense On item');

  const source = input.sourceId ? await PaymentSource.findOne({ _id: input.sourceId, userId: user._id }) : null;
  if (input.sourceId && !source) throw notFound('Payment source');

  const currency = (input.currency || user.currency).toUpperCase();
  const fxRate = await getRate(currency, user.currency);
  const amount = round2(input.amount);

  return {
    type: input.type,
    amount,
    currency,
    fxRate,
    amountBase: round2(amount * fxRate),
    baseCurrency: user.currency,
    categoryId: category._id,
    categoryName: category.name,
    expenseOnId: expenseOn?._id ?? null,
    expenseOnName: expenseOn?.name ?? null,
    sourceId: source?._id ?? null,
    sourceName: source?.name ?? null,
    note: input.note?.trim() || null,
  };
}

export async function createTransaction(user: UserDoc, input: TxInput, via: 'CHAT' | 'MANUAL' = 'MANUAL') {
  const fields = await resolveFields(user, input);
  return Transaction.create({
    ...fields,
    userId: user._id,
    occurredAt: input.occurredAt ?? new Date(),
    via,
  });
}

export async function updateTransaction(user: UserDoc, id: string, input: TxInput) {
  const tx = await Transaction.findOne({ _id: id, userId: user._id });
  if (!tx) throw notFound('Transaction');
  tx.set({ ...(await resolveFields(user, input)), occurredAt: input.occurredAt ?? tx.occurredAt });
  await tx.save();
  return tx;
}

/** Re-express every transaction in the user's new base currency (uses today's rates) */
export async function rebaseTransactions(userId: Types.ObjectId, newCurrency: string) {
  const currencies: string[] = await Transaction.distinct('currency', { userId });
  for (const currency of currencies) {
    const rate = await getRate(currency, newCurrency);
    await Transaction.updateMany(
      { userId, currency },
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
