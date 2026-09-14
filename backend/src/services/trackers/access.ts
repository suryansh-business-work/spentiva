import type { Types } from 'mongoose';
import { Tracker, type TrackerDoc, type TrackerRole } from '../../models/Tracker.js';
import type { UserDoc } from '../../models/User.js';
import { forbidden, notFound, validate } from '../../utils/errors.js';
import { zObjectId } from '../../utils/validators.js';
import type { ReportScope } from '../reports/types.js';

/** What a request needs to do with a tracker */
export type Need = 'VIEW' | 'EDIT' | 'OWN';

const RANK: Record<TrackerRole, number> = { VIEWER: 1, EDITOR: 2, OWNER: 3 };
const NEEDED: Record<Need, number> = { VIEW: 1, EDIT: 2, OWN: 3 };

const denied = (need: Need, name: string) =>
  need === 'OWN' ? `Only the owner of “${name}” can do this` : `You have view-only access to “${name}”. Ask the owner for edit access.`;

export function roleOf(tracker: TrackerDoc, userId: Types.ObjectId): TrackerRole | null {
  if (tracker.ownerId.equals(userId)) return 'OWNER';
  return tracker.members.find((m) => m.userId.equals(userId))?.role ?? null;
}

export const canEdit = (role: TrackerRole) => RANK[role] >= NEEDED.EDIT;

/** A user's default tracker: the first one they created (used when a request doesn't name one) */
export async function defaultTracker(userId: Types.ObjectId): Promise<TrackerDoc> {
  const tracker = await Tracker.findOne({ ownerId: userId }).sort({ createdAt: 1, _id: 1 });
  if (!tracker) throw notFound('Tracker');
  return tracker;
}

/** A tracker the user can use with at least `need` rights; no id means their default tracker */
export async function loadTracker(user: UserDoc, trackerId: string | null | undefined, need: Need) {
  const tracker = trackerId ? await Tracker.findById(validate(zObjectId, trackerId)) : await defaultTracker(user._id);
  const role = tracker ? roleOf(tracker, user._id) : null;
  if (!tracker || !role) throw notFound('Tracker');
  if (RANK[role] < NEEDED[need]) throw forbidden(denied(need, tracker.name));
  return { tracker, role };
}

/** Totals come in the tracker's currency; days and numbers follow the viewer's preferences */
export const scopeOf = (tracker: TrackerDoc, user: UserDoc): ReportScope => ({
  trackerId: tracker._id,
  currency: tracker.currency,
  budget: tracker.monthlyBudget ?? null,
  timezone: user.timezone,
  locale: user.locale,
});
