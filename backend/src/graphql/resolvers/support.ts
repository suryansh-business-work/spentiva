import { SupportTicket, type SupportTicketDoc } from '../../models/SupportTicket.js';
import type { UserDoc } from '../../models/User.js';
import { addReply, createTicket, ticketQuery, ticketUsers } from '../../services/support.js';
import { notFound, validate } from '../../utils/errors.js';
import { paging } from '../../utils/paging.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { PageZ, TicketFilterZ, TicketReplyZ, TicketUpdateZ, TicketZ } from '../inputs.js';
import { toTicket } from '../mappers.js';

const TICKET_SORT = ['lastMessageAt', 'createdAt', 'priority', 'status'] as const;

const summary = (u: UserDoc) => ({ id: u.id as string, name: u.name, email: u.email });

async function withOwner(ticket: SupportTicketDoc) {
  const users = await ticketUsers([ticket]);
  return toTicket(ticket, users.get(String(ticket.userId)) ?? null);
}

async function findTicket(id: string) {
  const ticket = await SupportTicket.findById(validate(zObjectId, id));
  if (!ticket) throw notFound('Support request');
  return ticket;
}

/** Help & support: users raise tickets from the app, admins answer them in the portal */
export const supportResolvers = {
  Query: {
    mySupportTickets: async (_: unknown, __: unknown, ctx: Context) => {
      const user = await ctx.user();
      const tickets = await SupportTicket.find({ userId: user._id }).sort({ lastMessageAt: -1 }).limit(100);
      return tickets.map((t) => toTicket(t, summary(user)));
    },
    supportTicket: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const user = await ctx.user();
      const ticket = await SupportTicket.findById(validate(zObjectId, id));
      if (!ticket) return null;
      if (!ticket.userId.equals(user._id) && user.role !== 'ADMIN') return null;
      return withOwner(ticket);
    },
    adminTickets: async (_: unknown, args: { filter?: unknown; page?: unknown }, ctx: Context) => {
      await ctx.admin();
      const q = ticketQuery(validate(TicketFilterZ, args.filter ?? {}));
      const p = paging(validate(PageZ, args.page ?? {}), TICKET_SORT, 'lastMessageAt');
      const [items, total] = await Promise.all([SupportTicket.find(q).sort(p.sort).skip(p.skip).limit(p.limit), SupportTicket.countDocuments(q)]);
      const users = await ticketUsers(items);
      return { items: items.map((t) => toTicket(t, users.get(String(t.userId)) ?? null)), total };
    },
  },
  Mutation: {
    createSupportTicket: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const user = await ctx.user();
      return toTicket(await createTicket(user, validate(TicketZ, input), ctx.client), summary(user));
    },
    replySupportTicket: async (_: unknown, args: { id: string; body: string }, ctx: Context) => {
      const user = await ctx.user();
      const ticket = await SupportTicket.findOne({ _id: validate(zObjectId, args.id), userId: user._id });
      if (!ticket) throw notFound('Support request');
      await addReply(ticket, user, 'USER', validate(TicketReplyZ, args.body));
      return toTicket(ticket, summary(user));
    },
    adminReplyTicket: async (_: unknown, args: { id: string; body: string; status?: unknown }, ctx: Context) => {
      const admin = await ctx.admin();
      const ticket = await findTicket(args.id);
      const { status } = validate(TicketUpdateZ, { status: args.status });
      await addReply(ticket, admin, 'ADMIN', validate(TicketReplyZ, args.body), status);
      return withOwner(ticket);
    },
    adminUpdateTicket: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      await ctx.admin();
      const ticket = await findTicket(args.id);
      const data = validate(TicketUpdateZ, args.input);
      ticket.set({ ...(data.status && { status: data.status }), ...(data.priority && { priority: data.priority }) });
      await ticket.save();
      return withOwner(ticket);
    },
  },
};
