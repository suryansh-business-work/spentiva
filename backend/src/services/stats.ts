import type { Types } from 'mongoose';
import { AppLog } from '../models/AppLog.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { dayKeys, lastDaysRange, type Range } from '../utils/time.js';

const DAY = 86_400_000;
const CHART_DAYS = 14;
const ago = (ms: number) => new Date(Date.now() - ms);
const dayOf = (field: string, tz: string) => ({ $dateToString: { format: '%Y-%m-%d', date: `$${field}`, timezone: tz } });

async function counts() {
  const [users, newUsers7d, activeUsers7d, disabledUsers, transactions7d, crashes24h, errors24h, unresolvedErrors, openTickets] = await Promise.all([
    User.estimatedDocumentCount(),
    User.countDocuments({ createdAt: { $gte: ago(7 * DAY) } }),
    User.countDocuments({ lastSeenAt: { $gte: ago(7 * DAY) } }),
    User.countDocuments({ disabled: true }),
    Transaction.countDocuments({ createdAt: { $gte: ago(7 * DAY) } }),
    AppLog.countDocuments({ level: 'FATAL', occurredAt: { $gte: ago(DAY) } }),
    AppLog.countDocuments({ level: 'ERROR', occurredAt: { $gte: ago(DAY) } }),
    AppLog.countDocuments({ level: { $in: ['FATAL', 'ERROR'] }, resolved: false }),
    SupportTicket.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
  ]);
  return { users, newUsers7d, activeUsers7d, disabledUsers, transactions7d, crashes24h, errors24h, unresolvedErrors, openTickets };
}

/** FATAL / ERROR / WARN per day, in the admin's time zone */
async function logsByDay(range: Range, tz: string) {
  const rows = await AppLog.aggregate<{ _id: { day: string; level: string }; n: number }>([
    { $match: { occurredAt: { $gte: range.from, $lt: range.to }, level: { $in: ['FATAL', 'ERROR', 'WARN'] } } },
    { $group: { _id: { day: dayOf('occurredAt', tz), level: '$level' }, n: { $sum: 1 } } },
  ]);
  const n = new Map(rows.map((r) => [`${r._id.day}|${r._id.level}`, r.n]));
  return dayKeys(range, tz).map((date) => ({
    date,
    fatal: n.get(`${date}|FATAL`) ?? 0,
    error: n.get(`${date}|ERROR`) ?? 0,
    warn: n.get(`${date}|WARN`) ?? 0,
  }));
}

async function signupsByDay(range: Range, tz: string) {
  const rows = await User.aggregate<{ _id: string; n: number }>([
    { $match: { createdAt: { $gte: range.from, $lt: range.to } } },
    { $group: { _id: dayOf('createdAt', tz), n: { $sum: 1 } } },
  ]);
  const n = new Map(rows.map((r) => [r._id, r.n]));
  return dayKeys(range, tz).map((date) => ({ date, count: n.get(date) ?? 0 }));
}

/** App builds used in the last 30 days (by active users) */
async function appVersions() {
  const rows = await User.aggregate<{ _id: string; n: number }>([
    { $match: { lastSeenAt: { $gte: ago(30 * DAY) } } },
    { $group: { _id: { $ifNull: ['$appVersion', 'unknown'] }, n: { $sum: 1 } } },
    { $sort: { n: -1 } },
    { $limit: 8 },
  ]);
  return rows.map((r) => ({ name: r._id, count: r.n }));
}

/** Most frequent unresolved crashes / errors of the last 7 days */
async function topErrors() {
  const rows = await AppLog.aggregate<{
    _id: string;
    count: number;
    users: unknown[];
    lastAt: Date;
    logId: Types.ObjectId;
    message: string;
    level: string;
    source: string;
  }>([
    { $match: { occurredAt: { $gte: ago(7 * DAY) }, level: { $in: ['FATAL', 'ERROR'] }, resolved: false } },
    { $sort: { occurredAt: -1 } },
    {
      $group: {
        _id: '$fingerprint',
        count: { $sum: 1 },
        users: { $addToSet: '$userId' },
        lastAt: { $first: '$occurredAt' },
        logId: { $first: '$_id' },
        message: { $first: '$message' },
        level: { $first: '$level' },
        source: { $first: '$source' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  return rows.map((r) => ({ ...r, fingerprint: r._id, logId: r.logId.toHexString(), users: r.users.filter(Boolean).length }));
}

/** Portal dashboard */
export async function adminStats(tz: string) {
  const range = lastDaysRange(CHART_DAYS, tz, new Date());
  const [totals, logs, signups, versions, top] = await Promise.all([
    counts(),
    logsByDay(range, tz),
    signupsByDay(range, tz),
    appVersions(),
    topErrors(),
  ]);
  return { ...totals, logsByDay: logs, signupsByDay: signups, appVersions: versions, topErrors: top };
}
