import type { CategoryDoc } from '../../models/Category.js';
import type { TransactionDoc } from '../../models/Transaction.js';
import { formatMoney } from '../../utils/money.js';
import { localToday, startOfLocalDate } from '../../utils/time.js';
import { isCurrency } from '../../utils/validators.js';
import type { ParsedTx } from '../ai.js';
import { createTransaction } from '../transactions.js';
import { CANCEL, option, sameName, withIds, type Ctx, type Option, type TxType } from './context.js';

/** A partially understood transaction, stored on OPTIONS messages until the user picks */
export interface Draft {
  type: TxType;
  typeConfident: boolean;
  amount: number | null;
  currency: string | null;
  categoryId: string | null;
  categoryGuess: string | null;
  categoryOptions: string[];
  expenseOnId: string | null;
  expenseOnGuess: string | null;
  expenseOnDone: boolean;
  sourceId: string | null;
  sourceGuess: string | null;
  note: string | null;
  date: string | null;
}

export type Step = { kind: 'DONE'; tx: TransactionDoc } | { kind: 'ASK'; text: string; options: Option[] } | { kind: 'TEXT'; text: string };
type Ask = Extract<Step, { kind: 'ASK' }>;

function findItem(categories: CategoryDoc[], name: string | null) {
  if (!name) return null;
  for (const category of categories) {
    const item = category.items.find((i) => sameName(i.name, name));
    if (item) return { category, itemId: String(item._id) };
  }
  return null;
}

export function draftFromParsed(p: ParsedTx, ctx: Ctx): Draft {
  const sameType = ctx.categories.filter((c) => c.type === p.type);
  const named = sameType.find((c) => sameName(c.name, p.category));
  const match = findItem(named ? [named] : sameType, p.expenseOn ?? p.expenseOnGuess);
  const category = match?.category ?? named;
  const source = ctx.sources.find((s) => sameName(s.name, p.source) || sameName(s.name, p.sourceGuess));
  const guess = match ? null : (p.expenseOnGuess ?? p.expenseOn);
  // Ignore "guesses" that just repeat the category name ("spent 20 on food")
  const expenseOnGuess = guess && !sameName(guess, category?.name ?? p.categoryGuess) ? guess : null;
  return {
    type: p.type,
    typeConfident: p.typeConfident,
    amount: p.amount,
    currency: p.currency && isCurrency(p.currency) ? p.currency.toUpperCase() : null,
    categoryId: category?.id ?? null,
    categoryGuess: category ? null : (p.categoryGuess ?? p.category),
    categoryOptions: p.categoryOptions,
    expenseOnId: match?.itemId ?? null,
    expenseOnGuess,
    expenseOnDone: Boolean(match),
    sourceId: source?.id ?? null,
    sourceGuess: source ? null : (p.sourceGuess ?? p.source),
    note: p.note,
    date: p.date,
  };
}

function askType(draft: Draft, amountText: string): Ask | null {
  if (draft.typeConfident) return null;
  return {
    kind: 'ASK',
    text: `Is ${amountText} an expense or an income?`,
    options: withIds([option('SET_TYPE', 'Expense', 'EXPENSE'), option('SET_TYPE', 'Income', 'INCOME'), CANCEL]),
  };
}

function categoryQuestion(guess: string | null, suggested: number, amountText: string): string {
  if (guess) return `I couldn't find a “${guess}” category. Where should ${amountText} go?`;
  if (suggested > 1) return `Which category fits ${amountText} best?`;
  return `Which category is ${amountText} for?`;
}

function askCategory(ctx: Ctx, draft: Draft, amountText: string): Ask | null {
  const cats = ctx.categories.filter((c) => c.type === draft.type);
  if (cats.some((c) => c.id === draft.categoryId)) return null;
  const suggested = [...new Set(draft.categoryOptions.map((n) => cats.find((c) => sameName(c.name, n))).filter((c) => c !== undefined))];
  const shown = suggested.length ? suggested.slice(0, 4) : cats.slice(0, 6);
  const list = shown.map((c) => option('SET_CATEGORY', c.name, c.id));
  const guess = draft.categoryGuess;
  if (guess && !cats.some((c) => sameName(c.name, guess))) list.push(option('CREATE_CATEGORY', `+ New “${guess}”`, guess));
  list.push(CANCEL);
  return { kind: 'ASK', text: categoryQuestion(guess, suggested.length, amountText), options: withIds(list) };
}

function askExpenseOn(ctx: Ctx, draft: Draft): Ask | null {
  if (draft.expenseOnDone || !draft.expenseOnGuess) return null;
  const category = ctx.categories.find((c) => c.id === draft.categoryId);
  if (!category) return null;
  const item = category.items.find((i) => sameName(i.name, draft.expenseOnGuess));
  if (item) {
    draft.expenseOnId = String(item._id);
    draft.expenseOnDone = true;
    return null;
  }
  const list = category.items.slice(0, 4).map((i) => option('SET_EXPENSE_ON', i.name, String(i._id)));
  list.push(option('ADD_EXPENSE_ON', `+ Add “${draft.expenseOnGuess}”`, draft.expenseOnGuess), option('SKIP_EXPENSE_ON', 'Skip'));
  return { kind: 'ASK', text: `“${draft.expenseOnGuess}” isn't under ${category.name} yet. Add it, or pick one:`, options: withIds(list) };
}

function askSource(ctx: Ctx, draft: Draft, amountText: string): Ask | null {
  if (draft.sourceId) return null;
  if (draft.sourceGuess) {
    const list = ctx.sources.slice(0, 5).map((s) => option('SET_SOURCE', s.name, s.id));
    list.push(option('CREATE_SOURCE', `+ Add “${draft.sourceGuess}”`, draft.sourceGuess), CANCEL);
    return { kind: 'ASK', text: `I don't see “${draft.sourceGuess}” in your payment modes. Which one did you use?`, options: withIds(list) };
  }
  const preferred = ctx.sources.find((s) => s.isDefault) ?? ctx.sources[0];
  if (preferred) {
    draft.sourceId = preferred.id;
    return null;
  }
  return {
    kind: 'ASK',
    text: `Which payment mode did you use for ${amountText}?`,
    options: withIds(['Cash', 'UPI', 'Debit Card', 'Credit Card'].map((n) => option('CREATE_SOURCE', n, n))),
  };
}

/** Past days are stored at local noon so they land in the right day bucket */
function occurredAt(draft: Draft, tz: string): Date {
  if (!draft.date || draft.date === localToday(tz)) return new Date();
  const day = startOfLocalDate(draft.date, tz);
  return day ? new Date(day.getTime() + 12 * 3_600_000) : new Date();
}

/** Ask for the next missing piece, or log the transaction when everything is known */
export async function advance(ctx: Ctx, draft: Draft): Promise<Step> {
  if (!draft.amount) return { kind: 'TEXT', text: 'How much was it? Try something like “250 on lunch”.' };
  const amountText = formatMoney(draft.amount, draft.currency ?? ctx.tracker.currency, ctx.user.locale);
  const question = askType(draft, amountText) ?? askCategory(ctx, draft, amountText) ?? askExpenseOn(ctx, draft) ?? askSource(ctx, draft, amountText);
  if (question) return question;
  const categoryId = draft.categoryId;
  if (!categoryId) return { kind: 'TEXT', text: 'Which category was it for?' };
  const tx = await createTransaction(
    ctx.user,
    ctx.tracker,
    {
      type: draft.type,
      amount: draft.amount,
      currency: draft.currency,
      categoryId,
      expenseOnId: draft.expenseOnId,
      sourceId: draft.sourceId,
      note: draft.note,
      occurredAt: occurredAt(draft, ctx.user.timezone),
    },
    'CHAT',
  );
  return { kind: 'DONE', tx };
}
