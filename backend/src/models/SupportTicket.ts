import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
export const TICKET_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
export const TICKET_CATEGORIES = ['BUG', 'QUESTION', 'FEEDBACK', 'ACCOUNT', 'OTHER'] as const;
export const TICKET_AUTHORS = ['USER', 'ADMIN'] as const;

const TicketMessageSchema = new Schema(
  {
    author: { type: String, enum: TICKET_AUTHORS, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    authorName: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/** Help request raised from the app (Profile → Help & support), answered from the portal */
const SupportTicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: TICKET_CATEGORIES, default: 'OTHER' },
    status: { type: String, enum: TICKET_STATUSES, default: 'OPEN' },
    priority: { type: String, enum: TICKET_PRIORITIES, default: 'NORMAL' },
    messages: { type: [TicketMessageSchema], default: [] },
    /** App build the ticket was raised from */
    appVersion: { type: String, default: null },
    platform: { type: String, default: null },
    lastMessageAt: { type: Date, required: true },
  },
  { timestamps: true },
);

SupportTicketSchema.index({ userId: 1, lastMessageAt: -1 });
SupportTicketSchema.index({ status: 1, lastMessageAt: -1 });

export type SupportTicketDoc = HydratedDocument<InferSchemaType<typeof SupportTicketSchema>>;
export const SupportTicket = model('SupportTicket', SupportTicketSchema);
