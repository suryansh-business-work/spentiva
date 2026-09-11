import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

/** "Expense From" – where the money came from / went to (Credit Card, Debit Card, UPI, Cash …) */
const PaymentSourceSchema = new Schema(
  {
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'wallet' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PaymentSourceSchema.index({ trackerId: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export type PaymentSourceDoc = HydratedDocument<InferSchemaType<typeof PaymentSourceSchema>>;
export const PaymentSource = model('PaymentSource', PaymentSourceSchema);
