import type { Types } from 'mongoose';
import { Category } from '../../models/Category.js';
import { ChatMessage } from '../../models/ChatMessage.js';
import { PaymentSource } from '../../models/PaymentSource.js';
import { Tracker } from '../../models/Tracker.js';
import { Transaction } from '../../models/Transaction.js';
import { User } from '../../models/User.js';

/** Fields users had before trackers existed (budget moved to the tracker) */
interface LegacyUser {
  _id: Types.ObjectId;
  name: string;
  currency: string;
  monthlyBudget?: number | null;
}

/** Give a user without a tracker a "Home" tracker holding the data they had before trackers existed */
async function moveIntoHomeTracker(user: LegacyUser): Promise<void> {
  const tracker = await Tracker.create({
    name: 'Home',
    kind: 'PERSONAL',
    currency: user.currency,
    monthlyBudget: user.monthlyBudget ?? null,
    ownerId: user._id,
  });
  // Raw collection updates: `userId` is no longer part of the category / payment mode schema
  const legacy = { userId: user._id, trackerId: { $exists: false } };
  const set = { $set: { trackerId: tracker._id } };
  await Promise.all([
    Category.collection.updateMany(legacy, set),
    PaymentSource.collection.updateMany(legacy, set),
    ChatMessage.collection.updateMany(legacy, set),
    Transaction.collection.updateMany(legacy, { $set: { trackerId: tracker._id, userName: user.name } }),
  ]);
}

/**
 * One-time move to trackers, safe on every boot: users without a tracker get "Home" with their
 * existing categories, payment modes, entries and chat. Indexes are synced afterwards so the old
 * per-user unique indexes make way for per-tracker ones, then the leftover fields are removed.
 */
export async function migrateToTrackers(): Promise<void> {
  const owners = new Set((await Tracker.distinct('ownerId')).map(String));
  const users = await User.collection.find({}, { projection: { name: 1, currency: 1, monthlyBudget: 1 } }).toArray();
  const pending = (users as unknown as LegacyUser[]).filter((u) => !owners.has(String(u._id)));
  for (const user of pending) await moveIntoHomeTracker(user);
  if (pending.length) console.log(`Trackers: moved ${pending.length} user(s) into a Home tracker`);

  await Promise.all([Category.syncIndexes(), PaymentSource.syncIndexes(), Transaction.syncIndexes(), ChatMessage.syncIndexes()]);

  const unset = (field: string) => ({ $unset: { [field]: '' } });
  const has = (field: string) => ({ [field]: { $exists: true } });
  await Promise.all([
    Category.collection.updateMany(has('userId'), unset('userId')),
    PaymentSource.collection.updateMany(has('userId'), unset('userId')),
    User.collection.updateMany(has('monthlyBudget'), unset('monthlyBudget')),
  ]);
}
