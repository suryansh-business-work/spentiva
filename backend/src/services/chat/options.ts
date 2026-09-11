import { Category, type CategoryDoc } from '../../models/Category.js';
import { PaymentSource } from '../../models/PaymentSource.js';
import { badInput, isDuplicateKey } from '../../utils/errors.js';
import { sameName, type Ctx } from './context.js';
import type { Draft } from './draft.js';

const NEW_COLORS = ['#5DA314', '#F2B705', '#E5484D', '#3B82F6', '#8B5CF6', '#22C3E6', '#F97316', '#EC4899', '#14B8A6'];

type Handler = (ctx: Ctx, draft: Draft, value: string) => Promise<void> | void;

const cleanName = (value: string, what: string) => {
  const name = value.trim().slice(0, 60);
  if (!name) throw badInput(`${what} name missing`);
  return name;
};

async function findOrCreateCategory(ctx: Ctx, type: Draft['type'], name: string): Promise<CategoryDoc> {
  const existing = ctx.categories.find((c) => c.type === type && sameName(c.name, name));
  if (existing) return existing;
  try {
    const created = await Category.create({
      trackerId: ctx.tracker._id,
      name,
      type,
      icon: 'other',
      color: NEW_COLORS[ctx.categories.length % NEW_COLORS.length],
    });
    ctx.categories.push(created);
    return created;
  } catch (err) {
    if (!isDuplicateKey(err)) throw err;
    const found = await Category.findOne({ trackerId: ctx.tracker._id, type, name }).collation({ locale: 'en', strength: 2 });
    if (!found) throw err;
    return found;
  }
}

const HANDLERS: Record<string, Handler> = {
  SET_TYPE(ctx, draft, value) {
    draft.type = value === 'INCOME' ? 'INCOME' : 'EXPENSE';
    draft.typeConfident = true;
    const category = ctx.categories.find((c) => c.id === draft.categoryId);
    if (category && category.type !== draft.type) draft.categoryId = null;
  },
  SET_CATEGORY(_ctx, draft, value) {
    draft.categoryId = value;
    draft.categoryGuess = null;
  },
  async CREATE_CATEGORY(ctx, draft, value) {
    const category = await findOrCreateCategory(ctx, draft.type, cleanName(value, 'Category'));
    draft.categoryId = category.id;
    draft.categoryGuess = null;
  },
  SET_EXPENSE_ON(_ctx, draft, value) {
    draft.expenseOnId = value;
    draft.expenseOnDone = true;
  },
  async ADD_EXPENSE_ON(ctx, draft, value) {
    const category = ctx.categories.find((c) => c.id === draft.categoryId);
    if (!category) throw badInput('Pick a category first');
    const name = cleanName(value, 'Item');
    let item = category.items.find((i) => sameName(i.name, name));
    if (!item) {
      category.items.push({ name });
      await category.save();
      item = category.items.at(-1);
    }
    draft.expenseOnId = item ? String(item._id) : null;
    draft.expenseOnDone = true;
  },
  SKIP_EXPENSE_ON(_ctx, draft) {
    draft.note = draft.note ?? draft.expenseOnGuess;
    draft.expenseOnDone = true;
  },
  SET_SOURCE(_ctx, draft, value) {
    draft.sourceId = value;
    draft.sourceGuess = null;
  },
  async CREATE_SOURCE(ctx, draft, value) {
    const name = cleanName(value, 'Payment mode');
    let source = ctx.sources.find((s) => sameName(s.name, name));
    if (!source) {
      source = await PaymentSource.create({ trackerId: ctx.tracker._id, name, icon: 'wallet', isDefault: ctx.sources.length === 0 });
      ctx.sources.push(source);
    }
    draft.sourceId = source.id;
    draft.sourceGuess = null;
  },
};

/** Apply a picked chat option to the pending draft */
export async function applyOption(ctx: Ctx, draft: Draft, action: string, value: string | null) {
  const handler = HANDLERS[action];
  if (!handler) throw badInput(`Unsupported option ${action}`);
  await handler(ctx, draft, value ?? '');
}
