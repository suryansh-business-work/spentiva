import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const ChatOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    /** SET_CATEGORY | CREATE_CATEGORY | SET_EXPENSE_ON | ADD_EXPENSE_ON | SKIP_EXPENSE_ON | SET_SOURCE | CREATE_SOURCE | SET_TYPE | RUN_REPORT | PROMPT | UNDO | CANCEL */
    action: { type: String, required: true },
    value: { type: String, default: null },
  },
  { _id: false },
);

/** One conversation per user and tracker */
const ChatMessageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    role: { type: String, enum: ['USER', 'ASSISTANT'], required: true },
    kind: { type: String, enum: ['TEXT', 'TRANSACTION', 'OPTIONS', 'REPORT', 'ERROR'], default: 'TEXT' },
    text: { type: String, required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', default: null },
    /** Partially parsed transaction waiting for the user to pick an option */
    draft: { type: Schema.Types.Mixed, default: null },
    options: { type: [ChatOptionSchema], default: [] },
    selectedOptionId: { type: String, default: null },
    /** Serialized report (chart data) for REPORT messages */
    report: { type: Schema.Types.Mixed, default: null },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ChatMessageSchema.index({ userId: 1, trackerId: 1, createdAt: -1 });

export type ChatMessageDoc = HydratedDocument<InferSchemaType<typeof ChatMessageSchema>>;
export const ChatMessage = model('ChatMessage', ChatMessageSchema);
