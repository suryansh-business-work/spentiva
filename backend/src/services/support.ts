import type { z } from 'zod';
import type { ClientInfo } from '../graphql/client.js';
import type { TicketFilterZ, TicketZ } from '../graphql/inputs.js';
import { SupportTicket, type SupportTicketDoc } from '../models/SupportTicket.js';
import { User, type UserDoc } from '../models/User.js';
import { escapeRegex } from '../utils/validators.js';

type TicketFilter = z.infer<typeof TicketFilterZ>;

export function createTicket(user: UserDoc, input: z.infer<typeof TicketZ>, client: ClientInfo) {
  return SupportTicket.create({
    userId: user._id,
    subject: input.subject,
    category: input.category,
    messages: [{ author: 'USER', authorId: user._id, authorName: user.name, body: input.message }],
    appVersion: client.appVersion,
    platform: client.platform,
    lastMessageAt: new Date(),
  });
}

const OPEN_STATES = new Set(['OPEN', 'IN_PROGRESS']);

type TicketStatus = SupportTicketDoc['status'];

/** Status after a reply: a user reply reopens a closed ticket, the first admin reply means "in progress" */
function statusAfterReply(current: TicketStatus, as: 'USER' | 'ADMIN'): TicketStatus {
  if (as === 'USER') return OPEN_STATES.has(current) ? current : 'OPEN';
  return current === 'OPEN' ? 'IN_PROGRESS' : current;
}

/** Adds a message; an admin can set the status in the same step */
export async function addReply(ticket: SupportTicketDoc, author: UserDoc, as: 'USER' | 'ADMIN', body: string, status?: TicketStatus | null) {
  ticket.messages.push({ author: as, authorId: author._id, authorName: author.name, body });
  ticket.lastMessageAt = new Date();
  ticket.status = status ?? statusAfterReply(ticket.status, as);
  await ticket.save();
  return ticket;
}

export function ticketQuery(f: TicketFilter): Record<string, unknown> {
  const q: Record<string, unknown> = {};
  if (f.status) q.status = f.status;
  if (f.priority) q.priority = f.priority;
  if (f.category) q.category = f.category;
  if (f.userId) q.userId = f.userId;
  if (f.search) q.subject = new RegExp(escapeRegex(f.search), 'i');
  return q;
}

export type TicketUser = { id: string; name: string; email: string };

/** Owners of a page of tickets, loaded in one query */
export async function ticketUsers(tickets: SupportTicketDoc[]): Promise<Map<string, TicketUser>> {
  const ids = [...new Set(tickets.map((t) => String(t.userId)))];
  const users = await User.find({ _id: { $in: ids } }, { name: 1, email: 1 }).lean();
  return new Map(users.map((u) => [String(u._id), { id: String(u._id), name: u.name, email: u.email }]));
}
