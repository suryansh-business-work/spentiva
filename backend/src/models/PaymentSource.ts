import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

/** "Expense From" – where the money came from / went to (Credit Card, Debit Card, UPI, Cash …) */
const PaymentSourceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'wallet' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PaymentSourceSchema.index({ userId: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export type PaymentSourceDoc = HydratedDocument<InferSchemaType<typeof PaymentSourceSchema>>;
export const PaymentSource = model('PaymentSource', PaymentSourceSchema);
