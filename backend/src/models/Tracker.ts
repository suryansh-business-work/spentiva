import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

export const TRACKER_KINDS = ['PERSONAL', 'BUSINESS'] as const;
/** Roles a tracker can be shared with (the owner is stored separately) */
export const MEMBER_ROLES = ['EDITOR', 'VIEWER'] as const;

export type TrackerKind = (typeof TRACKER_KINDS)[number];
export type MemberRole = (typeof MEMBER_ROLES)[number];
export type TrackerRole = 'OWNER' | MemberRole;

const MemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: MEMBER_ROLES, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

/**
 * A separate book of expenses (e.g. Home, Business). Categories, payment modes, entries and chat
 * belong to a tracker; its owner can share it with other users as editors or viewers.
 */
const TrackerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: TRACKER_KINDS, required: true },
    /** ISO 4217 base currency every entry is converted to */
    currency: { type: String, required: true },
    monthlyBudget: { type: Number, default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: { type: [MemberSchema], default: [] },
  },
  { timestamps: true },
);

TrackerSchema.index({ ownerId: 1, createdAt: 1 });
TrackerSchema.index({ 'members.userId': 1 });

export type TrackerDoc = HydratedDocument<InferSchemaType<typeof TrackerSchema>>;
export const Tracker = model('Tracker', TrackerSchema);
