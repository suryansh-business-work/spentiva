import { z } from 'zod';
import { localDateKey, zoned } from '@/lib/format';
import type { Transaction, TransactionInput } from '@/lib/types';
import { toAmount, zAmount, zCurrencyCode } from '../validators';

export const transactionSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME']),
  amount: zAmount,
  currency: zCurrencyCode,
  categoryId: z.string().min(1, 'Pick a category'),
  expenseOnId: z.string().nullable(),
  sourceId: z.string().nullable(),
  note: z.string().max(200, 'Keep the note under 200 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
});

export type TransactionValues = z.infer<typeof transactionSchema>;

export const transactionDefaults = (currency: string, timeZone: string, sourceId: string | null): TransactionValues => ({
  type: 'EXPENSE',
  amount: '',
  currency,
  categoryId: '',
  expenseOnId: null,
  sourceId,
  note: '',
  date: localDateKey(Date.now(), timeZone),
});

export const fromTransaction = (tx: Transaction, timeZone: string): TransactionValues => ({
  type: tx.type,
  amount: String(tx.amount),
  currency: tx.currency,
  categoryId: tx.categoryId ?? '',
  expenseOnId: tx.expenseOnId,
  sourceId: tx.sourceId,
  note: tx.note ?? '',
  date: localDateKey(tx.occurredAt, timeZone),
});

/** Calendar day in the user's zone → instant (keeps "now" for today, the original time when unchanged, else local noon) */
function toInstant(date: string, timeZone: string, original?: string | null): string {
  if (original && localDateKey(original, timeZone) === date) return original;
  if (!original && date === localDateKey(Date.now(), timeZone)) return new Date().toISOString();
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number);
  const deviceNoon = new Date(y, m - 1, d, 12);
  const drift = zoned(deviceNoon, timeZone).getTime() - deviceNoon.getTime();
  return new Date(deviceNoon.getTime() - drift).toISOString();
}

export const toTransactionInput = (v: TransactionValues, timeZone: string, original?: string | null): TransactionInput => ({
  type: v.type,
  amount: toAmount(v.amount),
  currency: v.currency,
  categoryId: v.categoryId,
  expenseOnId: v.expenseOnId,
  sourceId: v.sourceId,
  note: v.note.trim() || null,
  occurredAt: toInstant(v.date, timeZone, original),
});
