import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

/** "Expense On" – the dynamic sub-items of a category (e.g. Food → Groceries, Restaurant) */
const ExpenseOnSchema = new Schema({ name: { type: String, required: true, trim: true } });

const CategorySchema = new Schema(
  {
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['EXPENSE', 'INCOME'], required: true },
    icon: { type: String, default: 'other' },
    color: { type: String, default: '#6BBF1F' },
    items: { type: [ExpenseOnSchema], default: [] },
  },
  { timestamps: true },
);

CategorySchema.index({ trackerId: 1, type: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export type CategoryDoc = HydratedDocument<InferSchemaType<typeof CategorySchema>>;
export const Category = model('Category', CategorySchema);
