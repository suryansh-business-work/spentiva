import type { Types } from 'mongoose';
import { TRACKER_LIMITS } from '../../config/rules.js';
import { Category } from '../../models/Category.js';
import { ChatMessage } from '../../models/ChatMessage.js';
import { PaymentSource } from '../../models/PaymentSource.js';
import { ReportSchedule } from '../../models/ReportSchedule.js';
import { Tracker, type MemberRole, type TrackerDoc, type TrackerKind } from '../../models/Tracker.js';
import { Transaction } from '../../models/Transaction.js';
import { User, type UserDoc } from '../../models/User.js';
import { badInput, notFound } from '../../utils/errors.js';
import { seedTracker } from '../seed.js';
import { rebaseTransactions } from '../transactions.js';

export { canEdit, defaultTracker, loadTracker, roleOf, scopeOf, type Need } from './access.js';

export interface TrackerFields {
  name: string;
  kind: TrackerKind;
  currency: string;
  monthlyBudget?: number | null;
}

/** Missing or null = unchanged, except a null budget which clears it */
export interface TrackerChanges {
  name?: string | null;
  kind?: TrackerKind | null;
  currency?: string | null;
  monthlyBudget?: number | null;
}

/** New tracker with the starting categories and payment modes for its kind */
export async function createTracker(owner: UserDoc, input: TrackerFields): Promise<TrackerDoc> {
  if ((await Tracker.countDocuments({ ownerId: owner._id })) >= TRACKER_LIMITS.owned) {
    throw badInput(`You can have up to ${TRACKER_LIMITS.owned} trackers`);
  }
  const tracker = await Tracker.create({ ...input, monthlyBudget: input.monthlyBudget ?? null, ownerId: owner._id });
  await seedTracker(tracker._id, tracker.kind);
  return tracker;
}

/** Trackers the user owns (oldest first) followed by the ones shared with them */
export async function listTrackers(userId: Types.ObjectId): Promise<TrackerDoc[]> {
  const list = await Tracker.find({ $or: [{ ownerId: userId }, { 'members.userId': userId }] }).sort({ createdAt: 1, _id: 1 });
  return list.toSorted((a, b) => Number(b.ownerId.equals(userId)) - Number(a.ownerId.equals(userId)));
}

/** A new base currency re-expresses every entry in it */
export async function updateTracker(tracker: TrackerDoc, input: TrackerChanges): Promise<TrackerDoc> {
  const currencyChanged = Boolean(input.currency && input.currency !== tracker.currency);
  tracker.set({
    ...(input.name && { name: input.name }),
    ...(input.kind && { kind: input.kind }),
    ...(input.currency && { currency: input.currency }),
    ...(input.monthlyBudget !== undefined && { monthlyBudget: input.monthlyBudget }),
  });
  if (currencyChanged) await rebaseTransactions(tracker._id, tracker.currency);
  await tracker.save();
  return tracker;
}

/** Share with an existing Spentiva account; sharing again changes that person's role */
export async function shareTracker(tracker: TrackerDoc, email: string, role: MemberRole): Promise<TrackerDoc> {
  const invitee = await User.findOne({ email });
  if (!invitee) throw badInput(`No Spentiva account uses ${email}. Ask them to sign up first, then share again.`);
  if (tracker.ownerId.equals(invitee._id)) throw badInput('You already own this tracker');
  const member = tracker.members.find((m) => m.userId.equals(invitee._id));
  if (member) member.role = role;
  else if (tracker.members.length >= TRACKER_LIMITS.members) throw badInput(`A tracker can be shared with up to ${TRACKER_LIMITS.members} people`);
  else tracker.members.push({ userId: invitee._id, role });
  await tracker.save();
  return tracker;
}

function findMember(tracker: TrackerDoc, userId: string) {
  const member = tracker.members.find((m) => m.userId.equals(userId));
  if (!member) throw notFound('Member');
  return member;
}

export async function setMemberRole(tracker: TrackerDoc, userId: string, role: MemberRole): Promise<TrackerDoc> {
  findMember(tracker, userId).role = role;
  await tracker.save();
  return tracker;
}

/** Removes someone's access (also used when they leave) and stops their email reports for it */
export async function removeMember(tracker: TrackerDoc, userId: string): Promise<TrackerDoc> {
  const member = findMember(tracker, userId);
  tracker.set(
    'members',
    tracker.members.filter((m) => !m.userId.equals(member.userId)),
  );
  await Promise.all([tracker.save(), ReportSchedule.deleteMany({ trackerId: tracker._id, userId: member.userId })]);
  return tracker;
}

/** Everything that belongs to these trackers (entries, categories, payment modes, chat, email reports) */
export async function purgeTrackers(trackerIds: Types.ObjectId[]): Promise<void> {
  const q = { trackerId: { $in: trackerIds } };
  await Promise.all([
    Transaction.deleteMany(q),
    Category.deleteMany(q),
    PaymentSource.deleteMany(q),
    ChatMessage.deleteMany(q),
    ReportSchedule.deleteMany(q),
  ]);
  await Tracker.deleteMany({ _id: { $in: trackerIds } });
}

/** Deletes a tracker with all of its data; everyone keeps at least one tracker of their own */
export async function deleteTracker(tracker: TrackerDoc): Promise<boolean> {
  if ((await Tracker.countDocuments({ ownerId: tracker.ownerId })) <= 1) {
    throw badInput('This is your only tracker. Create another one before deleting it.');
  }
  await purgeTrackers([tracker._id]);
  return true;
}

export type Person = { id: string; name: string; email: string };

/** Owners and members of a list of trackers, loaded in one query */
export async function peopleOf(trackers: TrackerDoc[]): Promise<Map<string, Person>> {
  const ids = new Set(trackers.flatMap((t) => [String(t.ownerId), ...t.members.map((m) => String(m.userId))]));
  const users = await User.find({ _id: { $in: [...ids] } }, { name: 1, email: 1 }).lean();
  return new Map(users.map((u) => [String(u._id), { id: String(u._id), name: u.name, email: u.email }]));
}
