import { Schema, model } from 'mongoose';

/** App-wide configuration editable from the app's Settings → Environment screen (admins only) */
const AppSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    /** Secrets are stored AES-256-GCM encrypted */
    value: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

export const AppSetting = model('AppSetting', AppSettingSchema);
