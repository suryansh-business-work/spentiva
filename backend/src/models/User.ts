import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    /** ISO 4217 currency code used for totals and reports */
    currency: { type: String, required: true, default: 'INR' },
    /** IANA time zone, used to bucket days/months in reports */
    timezone: { type: String, required: true, default: 'UTC' },
    /** BCP 47 locale used for number formatting */
    locale: { type: String, required: true, default: 'en-IN' },
    monthlyBudget: { type: Number, default: null },
    /** ADMIN can edit the app-wide Environment settings (OpenAI, Slack). First user is ADMIN. */
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  },
  { timestamps: true },
);

export type UserDoc = HydratedDocument<InferSchemaType<typeof UserSchema>>;
export const User = model('User', UserSchema);
