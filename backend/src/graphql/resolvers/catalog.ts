import { Category } from '../../models/Category.js';
import { PaymentSource } from '../../models/PaymentSource.js';
import { Transaction } from '../../models/Transaction.js';
import { badInput, isDuplicateKey, notFound, validate } from '../../utils/errors.js';
import { zName, zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { CategoryUpdateZ, CategoryZ, SourceZ } from '../inputs.js';
import { toCategory, toSource } from '../mappers.js';

/** Turn Mongo duplicate-key errors into a friendly message */
async function unique<T>(name: string, work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (err) {
    if (isDuplicateKey(err)) throw badInput(`"${name}" already exists`);
    throw err;
  }
}

async function ownCategory(ctx: Context, id: string) {
  const user = await ctx.user();
  const category = await Category.findOne({ _id: validate(zObjectId, id), userId: user._id });
  if (!category) throw notFound('Category');
  return { user, category };
}

export const catalogResolvers = {
  Query: {
    categories: async (_: unknown, { type }: { type?: 'EXPENSE' | 'INCOME' | null }, ctx: Context) => {
      const user = await ctx.user();
      const list = await Category.find({ userId: user._id, ...(type && { type }) }).sort({ type: 1, name: 1 });
      return list.map(toCategory);
    },
    paymentSources: async (_: unknown, __: unknown, ctx: Context) => {
      const user = await ctx.user();
      return (await PaymentSource.find({ userId: user._id }).sort({ isDefault: -1, name: 1 })).map(toSource);
    },
  },

  Mutation: {
    createCategory: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const user = await ctx.user();
      const data = validate(CategoryZ, input);
      const items = [...new Set(data.items ?? [])].map((name) => ({ name }));
      const category = await unique(data.name, () =>
        Category.create({ userId: user._id, name: data.name, type: data.type, icon: data.icon ?? 'other', color: data.color ?? '#5DA314', items }),
      );
      return toCategory(category);
    },

    updateCategory: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const { user, category } = await ownCategory(ctx, args.id);
      const data = validate(CategoryUpdateZ, args.input);
      category.set({ ...(data.name && { name: data.name }), ...(data.icon && { icon: data.icon }), ...(data.color && { color: data.color }) });
      await unique(data.name ?? category.name, () => category.save());
      if (data.name) await Transaction.updateMany({ userId: user._id, categoryId: category._id }, { categoryName: category.name });
      return toCategory(category);
    },

    deleteCategory: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const { category } = await ownCategory(ctx, id);
      await category.deleteOne();
      return true;
    },

    addExpenseOn: async (_: unknown, args: { categoryId: string; name: string }, ctx: Context) => {
      const { category } = await ownCategory(ctx, args.categoryId);
      const name = validate(zName, args.name);
      if (category.items.some((i) => i.name.toLowerCase() === name.toLowerCase())) throw badInput(`"${name}" already exists`);
      category.items.push({ name });
      await category.save();
      return toCategory(category);
    },

    renameExpenseOn: async (_: unknown, args: { categoryId: string; itemId: string; name: string }, ctx: Context) => {
      const { user, category } = await ownCategory(ctx, args.categoryId);
      const item = category.items.id(validate(zObjectId, args.itemId));
      if (!item) throw notFound('Expense On item');
      item.name = validate(zName, args.name);
      await category.save();
      await Transaction.updateMany({ userId: user._id, expenseOnId: item._id }, { expenseOnName: item.name });
      return toCategory(category);
    },

    removeExpenseOn: async (_: unknown, args: { categoryId: string; itemId: string }, ctx: Context) => {
      const { category } = await ownCategory(ctx, args.categoryId);
      category.items.pull({ _id: validate(zObjectId, args.itemId) });
      await category.save();
      return toCategory(category);
    },

    createPaymentSource: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const user = await ctx.user();
      const data = validate(SourceZ, input);
      const isDefault = data.isDefault === true || (await PaymentSource.countDocuments({ userId: user._id })) === 0;
      if (isDefault) await PaymentSource.updateMany({ userId: user._id }, { isDefault: false });
      const source = await unique(data.name, () =>
        PaymentSource.create({ userId: user._id, name: data.name, icon: data.icon ?? 'wallet', isDefault }),
      );
      return toSource(source);
    },

    updatePaymentSource: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const user = await ctx.user();
      const data = validate(SourceZ, args.input);
      const source = await PaymentSource.findOne({ _id: validate(zObjectId, args.id), userId: user._id });
      if (!source) throw notFound('Payment source');
      if (data.isDefault) await PaymentSource.updateMany({ userId: user._id, _id: { $ne: source._id } }, { isDefault: false });
      source.set({ name: data.name, ...(data.icon && { icon: data.icon }), ...(data.isDefault && { isDefault: true }) });
      await unique(data.name, () => source.save());
      await Transaction.updateMany({ userId: user._id, sourceId: source._id }, { sourceName: source.name });
      return toSource(source);
    },

    deletePaymentSource: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const user = await ctx.user();
      const source = await PaymentSource.findOneAndDelete({ _id: validate(zObjectId, id), userId: user._id });
      if (!source) return false;
      if (source.isDefault) {
        const next = await PaymentSource.findOne({ userId: user._id }).sort({ name: 1 });
        if (next) await PaymentSource.updateOne({ _id: next._id }, { isDefault: true });
      }
      return true;
    },
  },
};
