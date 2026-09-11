import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['EXPENSE', 'INCOME'], required: true },
    /** Amount in the currency it was spent in */
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    /** Amount converted to the user's base currency at the time of logging */
    amountBase: { type: Number, required: true },
    baseCurrency: { type: String, required: true },
    fxRate: { type: Number, required: true, default: 1 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    categoryName: { type: String, required: true },
    expenseOnId: { type: Schema.Types.ObjectId, default: null },
    expenseOnName: { type: String, default: null },
    sourceId: { type: Schema.Types.ObjectId, ref: 'PaymentSource', default: null },
    sourceName: { type: String, default: null },
    note: { type: String, default: null, trim: true },
    occurredAt: { type: Date, required: true },
    via: { type: String, enum: ['CHAT', 'MANUAL'], default: 'MANUAL' },
  },
  { timestamps: true },
);

TransactionSchema.index({ userId: 1, occurredAt: -1 });
TransactionSchema.index({ userId: 1, type: 1, occurredAt: -1 });

export type TransactionDoc = HydratedDocument<InferSchemaType<typeof TransactionSchema>>;
export const Transaction = model('Transaction', TransactionSchema);
