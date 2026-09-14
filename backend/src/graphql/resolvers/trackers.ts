import type { Types } from 'mongoose';
import { Tracker, type TrackerDoc } from '../../models/Tracker.js';
import type { UserDoc } from '../../models/User.js';
import { listSchedules, sendTrackerReport, setSchedules } from '../../services/email/index.js';
import { createRateLimiter } from '../../services/rateLimit.js';
import {
  createTracker,
  deleteTracker,
  listTrackers,
  peopleOf,
  removeMember,
  setMemberRole,
  shareTracker,
  updateTracker,
} from '../../services/trackers/index.js';
import { badInput, validate } from '../../utils/errors.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { EmailPeriodZ, FrequenciesZ, MemberRoleZ, ShareZ, TrackerUpdateZ, TrackerZ } from '../inputs.js';
import { toSchedule, toTracker } from '../mappers.js';

/** "Send now" emails and share attempts (which reveal whether an email has an account) per user per hour */
const allowManualReport = createRateLimiter(10, 60 * 60_000);
const allowShare = createRateLimiter(30, 60 * 60_000);

async function defaultTrackerId(userId: Types.ObjectId): Promise<string | null> {
  const first = await Tracker.findOne({ ownerId: userId }, { _id: 1 }).sort({ createdAt: 1, _id: 1 }).lean();
  return first ? String(first._id) : null;
}

/** Trackers as the user sees them (their role, owner + members) */
async function present(user: UserDoc, trackers: TrackerDoc[]) {
  const [people, defaultId] = await Promise.all([peopleOf(trackers), defaultTrackerId(user._id)]);
  return trackers.map((t) => toTracker(t, user._id, people, defaultId));
}

const one = async (user: UserDoc, tracker: TrackerDoc) => (await present(user, [tracker]))[0];

type IdArgs = { id: string };
type MemberArgs = { id: string; userId: string; role?: unknown };
type TrackerArgs = { trackerId?: string | null };

/** Trackers (Home, Business …), sharing them with other users, and their email reports */
export const trackerResolvers = {
  Query: {
    trackers: async (_: unknown, __: unknown, ctx: Context) => {
      const user = await ctx.user();
      return present(user, await listTrackers(user._id));
    },
    emailReports: async (_: unknown, { trackerId }: TrackerArgs, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(trackerId, 'VIEW');
      return (await listSchedules(user._id, tracker._id)).map(toSchedule);
    },
  },
  Mutation: {
    createTracker: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const user = await ctx.user();
      return one(user, await createTracker(user, validate(TrackerZ, input)));
    },
    updateTracker: async (_: unknown, args: IdArgs & { input: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.id, 'OWN');
      return one(user, await updateTracker(tracker, validate(TrackerUpdateZ, args.input)));
    },
    deleteTracker: async (_: unknown, { id }: IdArgs, ctx: Context) => deleteTracker((await ctx.tracker(id, 'OWN')).tracker),
    shareTracker: async (_: unknown, args: IdArgs & { email: unknown; role: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.id, 'OWN');
      const { email, role } = validate(ShareZ, { email: args.email, role: args.role });
      if (!allowShare(user.id as string)) throw badInput('Too many share attempts. Please try again in an hour.');
      return one(user, await shareTracker(tracker, email, role));
    },
    setTrackerMemberRole: async (_: unknown, args: MemberArgs, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.id, 'OWN');
      return one(user, await setMemberRole(tracker, validate(zObjectId, args.userId), validate(MemberRoleZ, args.role)));
    },
    removeTrackerMember: async (_: unknown, args: MemberArgs, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.id, 'OWN');
      return one(user, await removeMember(tracker, validate(zObjectId, args.userId)));
    },
    leaveTracker: async (_: unknown, { id }: IdArgs, ctx: Context) => {
      const { user, tracker, role } = await ctx.tracker(id, 'VIEW');
      if (role === 'OWNER') throw badInput('You own this tracker. Delete it instead.');
      await removeMember(tracker, user.id as string);
      return true;
    },

    setEmailReports: async (_: unknown, args: TrackerArgs & { frequencies: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      const schedules = await setSchedules(user._id, tracker._id, user.timezone, validate(FrequenciesZ, args.frequencies));
      return schedules.map(toSchedule);
    },
    sendReportEmail: async (_: unknown, args: TrackerArgs & { period: unknown }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      const period = validate(EmailPeriodZ, args.period);
      if (!allowManualReport(user.id as string)) throw badInput('That is a lot of reports in one hour. Please try again later.');
      await sendTrackerReport(user, tracker, period);
      return user.email;
    },
  },
};
