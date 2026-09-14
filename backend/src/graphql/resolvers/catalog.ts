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

/** A category in a tracker the user can edit */
async function editableCategory(ctx: Context, id: string) {
  const category = await Category.findById(validate(zObjectId, id));
  if (!category) throw notFound('Category');
  await ctx.tracker(String(category.trackerId), 'EDIT');
  return category;
}

async function editableSource(ctx: Context, id: string) {
  const source = await PaymentSource.findById(validate(zObjectId, id));
  if (!source) throw notFound('Payment source');
  await ctx.tracker(String(source.trackerId), 'EDIT');
  return source;
}

type TrackerArgs = { trackerId?: string | null };

export const catalogResolvers = {
  Query: {
    categories: async (_: unknown, args: TrackerArgs & { type?: 'EXPENSE' | 'INCOME' | null }, ctx: Context) => {
      const { tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      const list = await Category.find({ trackerId: tracker._id, ...(args.type && { type: args.type }) }).sort({ type: 1, name: 1 });
      return list.map(toCategory);
    },
    paymentSources: async (_: unknown, args: TrackerArgs, ctx: Context) => {
      const { tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      return (await PaymentSource.find({ trackerId: tracker._id }).sort({ isDefault: -1, name: 1 })).map(toSource);
    },
  },

  Mutation: {
    createCategory: async (_: unknown, args: TrackerArgs & { input: unknown }, ctx: Context) => {
      const { tracker } = await ctx.tracker(args.trackerId, 'EDIT');
      const data = validate(CategoryZ, args.input);
      const items = [...new Set(data.items ?? [])].map((name) => ({ name }));
      const category = await unique(data.name, () =>
        Category.create({
          trackerId: tracker._id,
          name: data.name,
          type: data.type,
          icon: data.icon ?? 'other',
          color: data.color ?? '#5DA314',
          items,
        }),
      );
      return toCategory(category);
    },

    updateCategory: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const category = await editableCategory(ctx, args.id);
      const data = validate(CategoryUpdateZ, args.input);
      category.set({ ...(data.name && { name: data.name }), ...(data.icon && { icon: data.icon }), ...(data.color && { color: data.color }) });
      await unique(data.name ?? category.name, () => category.save());
      if (data.name) await Transaction.updateMany({ trackerId: category.trackerId, categoryId: category._id }, { categoryName: category.name });
      return toCategory(category);
    },

    deleteCategory: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const category = await editableCategory(ctx, id);
      await category.deleteOne();
      return true;
    },

    addExpenseOn: async (_: unknown, args: { categoryId: string; name: string }, ctx: Context) => {
      const category = await editableCategory(ctx, args.categoryId);
      const name = validate(zName, args.name);
      if (category.items.some((i) => i.name.toLowerCase() === name.toLowerCase())) throw badInput(`"${name}" already exists`);
      category.items.push({ name });
      await category.save();
      return toCategory(category);
    },

    renameExpenseOn: async (_: unknown, args: { categoryId: string; itemId: string; name: string }, ctx: Context) => {
      const category = await editableCategory(ctx, args.categoryId);
      const item = category.items.id(validate(zObjectId, args.itemId));
      if (!item) throw notFound('Expense On item');
      item.name = validate(zName, args.name);
      await category.save();
      await Transaction.updateMany({ trackerId: category.trackerId, expenseOnId: item._id }, { expenseOnName: item.name });
      return toCategory(category);
    },

    removeExpenseOn: async (_: unknown, args: { categoryId: string; itemId: string }, ctx: Context) => {
      const category = await editableCategory(ctx, args.categoryId);
      category.items.pull({ _id: validate(zObjectId, args.itemId) });
      await category.save();
      return toCategory(category);
    },

    createPaymentSource: async (_: unknown, args: TrackerArgs & { input: unknown }, ctx: Context) => {
      const { tracker } = await ctx.tracker(args.trackerId, 'EDIT');
      const data = validate(SourceZ, args.input);
      const trackerId = tracker._id;
      const isDefault = data.isDefault === true || (await PaymentSource.countDocuments({ trackerId })) === 0;
      if (isDefault) await PaymentSource.updateMany({ trackerId }, { isDefault: false });
      const source = await unique(data.name, () => PaymentSource.create({ trackerId, name: data.name, icon: data.icon ?? 'wallet', isDefault }));
      return toSource(source);
    },

    updatePaymentSource: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const source = await editableSource(ctx, args.id);
      const data = validate(SourceZ, args.input);
      const trackerId = source.trackerId;
      if (data.isDefault) await PaymentSource.updateMany({ trackerId, _id: { $ne: source._id } }, { isDefault: false });
      source.set({ name: data.name, ...(data.icon && { icon: data.icon }), ...(data.isDefault && { isDefault: true }) });
      await unique(data.name, () => source.save());
      await Transaction.updateMany({ trackerId, sourceId: source._id }, { sourceName: source.name });
      return toSource(source);
    },

    deletePaymentSource: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const source = await editableSource(ctx, id);
      await source.deleteOne();
      if (source.isDefault) {
        const next = await PaymentSource.findOne({ trackerId: source.trackerId }).sort({ name: 1 });
        if (next) await PaymentSource.updateOne({ _id: next._id }, { isDefault: true });
      }
      return true;
    },
  },
};
