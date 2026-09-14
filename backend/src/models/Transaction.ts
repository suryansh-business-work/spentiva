import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const TransactionSchema = new Schema(
  {
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    /** Who logged it (shown on shared trackers); the name is kept even if the account goes away */
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, default: null },
    type: { type: String, enum: ['EXPENSE', 'INCOME'], required: true },
    /** Amount in the currency it was spent in */
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    /** Amount converted to the tracker's base currency at the time of logging */
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

TransactionSchema.index({ trackerId: 1, occurredAt: -1 });
TransactionSchema.index({ trackerId: 1, type: 1, occurredAt: -1 });
TransactionSchema.index({ userId: 1 });

export type TransactionDoc = HydratedDocument<InferSchemaType<typeof TransactionSchema>>;
export const Transaction = model('Transaction', TransactionSchema);
