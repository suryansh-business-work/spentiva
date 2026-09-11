import type { Types } from 'mongoose';
import type { z } from 'zod';
import type { UserFilterZ, UserUpdateZ } from '../graphql/inputs.js';
import { AppLog } from '../models/AppLog.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { ReportSchedule } from '../models/ReportSchedule.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Tracker } from '../models/Tracker.js';
import { Transaction } from '../models/Transaction.js';
import { User, type UserDoc } from '../models/User.js';
import { badInput, notFound } from '../utils/errors.js';
import { escapeRegex } from '../utils/validators.js';
import { hashPassword } from './auth.js';
import { purgeTrackers } from './trackers/index.js';

type Counts = Map<string, number>;
export interface UserCounts {
  transactions: Counts;
  errors: Counts;
  tickets: Counts;
}

export function userQuery(f: z.infer<typeof UserFilterZ>): Record<string, unknown> {
  const q: Record<string, unknown> = {};
  if (f.role) q.role = f.role;
  if (typeof f.disabled === 'boolean') q.disabled = f.disabled;
  if (f.search) {
    const rx = new RegExp(escapeRegex(f.search), 'i');
    q.$or = [{ name: rx }, { email: rx }];
  }
  return q;
}

const countBy = async (rows: Promise<{ _id: Types.ObjectId; n: number }[]>): Promise<Counts> =>
  new Map((await rows).map((r) => [String(r._id), r.n]));

/** Transactions, errors (last 30 days) and tickets for a page of users */
export async function userCounts(ids: Types.ObjectId[]): Promise<UserCounts> {
  const since = new Date(Date.now() - 30 * 86_400_000);
  const group = { $group: { _id: '$userId', n: { $sum: 1 } } };
  const [transactions, errors, tickets] = await Promise.all([
    countBy(Transaction.aggregate([{ $match: { userId: { $in: ids } } }, group])),
    countBy(AppLog.aggregate([{ $match: { userId: { $in: ids }, level: { $in: ['FATAL', 'ERROR'] }, occurredAt: { $gte: since } } }, group])),
    countBy(SupportTicket.aggregate([{ $match: { userId: { $in: ids } } }, group])),
  ]);
  return { transactions, errors, tickets };
}

async function findUser(id: string) {
  const user = await User.findById(id);
  if (!user) throw notFound('User');
  return user;
}

/** Name / role / disabled. Admins can't lock themselves out and the last admin can't be demoted. */
export async function updateUser(admin: UserDoc, id: string, input: z.infer<typeof UserUpdateZ>) {
  const user = await findUser(id);
  const self = user.id === admin.id;
  if (self && (input.role === 'USER' || input.disabled)) throw badInput("You can't remove your own admin access or disable your own account");
  if (input.role === 'USER' && user.role === 'ADMIN' && (await User.countDocuments({ role: 'ADMIN' })) <= 1) {
    throw badInput('Spentiva needs at least one admin');
  }
  user.set({
    ...(input.name && { name: input.name }),
    ...(input.role && { role: input.role }),
    ...(typeof input.disabled === 'boolean' && { disabled: input.disabled }),
  });
  await user.save();
  return user;
}

export async function resetPassword(id: string, password: string) {
  const user = await findUser(id);
  user.passwordHash = await hashPassword(password);
  await user.save();
  return true;
}

/**
 * Removes the account and the trackers it owns (with everything in them), and takes it off trackers
 * shared with it. Entries it logged in other people's trackers stay (with its name); logs are kept.
 */
export async function deleteUser(admin: UserDoc, id: string) {
  const user = await findUser(id);
  if (user.id === admin.id) throw badInput("You can't delete your own account here");
  const userId = user._id;
  const owned = await Tracker.find({ ownerId: userId });
  await purgeTrackers(owned.map((t) => t._id));
  await Promise.all([
    Tracker.updateMany({ 'members.userId': userId }, { $pull: { members: { userId } } }),
    ChatMessage.deleteMany({ userId }),
    ReportSchedule.deleteMany({ userId }),
    SupportTicket.deleteMany({ userId }),
    AppLog.updateMany({ userId }, { $set: { userId: null } }),
  ]);
  await user.deleteOne();
  return true;
}
