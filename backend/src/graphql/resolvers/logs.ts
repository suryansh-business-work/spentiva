import { GraphQLError } from 'graphql';
import { LOG_LIMITS } from '../../config/rules.js';
import { AppLog } from '../../models/AppLog.js';
import { logOccurrences, logQuery, recordClientLogs } from '../../services/logs.js';
import { createRateLimiter } from '../../services/rateLimit.js';
import { validate } from '../../utils/errors.js';
import { paging } from '../../utils/paging.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { ClientLogsZ, LogFilterZ, LogIdsZ, LogResolveZ, PageZ, zFingerprint } from '../inputs.js';
import { toLog } from '../mappers.js';

const allowReports = createRateLimiter(LOG_LIMITS.perMinute, 60_000);
const LOG_SORT = ['occurredAt', 'level', 'source', 'appVersion'] as const;

type ListArgs = { filter?: unknown; page?: unknown };

/** Crash / error logs: public reporting (app + portal) and the portal's Logs section */
export const logResolvers = {
  Query: {
    adminLogs: async (_: unknown, args: ListArgs, ctx: Context) => {
      await ctx.admin();
      const q = logQuery(validate(LogFilterZ, args.filter ?? {}));
      const p = paging(validate(PageZ, args.page ?? {}), LOG_SORT, 'occurredAt');
      const [items, total] = await Promise.all([AppLog.find(q).sort(p.sort).skip(p.skip).limit(p.limit), AppLog.countDocuments(q)]);
      return { items: items.map(toLog), total };
    },
    adminLog: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      await ctx.admin();
      const log = await AppLog.findById(validate(zObjectId, id));
      return log ? toLog(log) : null;
    },
    adminLogOccurrences: async (_: unknown, { fingerprint }: { fingerprint: string }, ctx: Context) => {
      await ctx.admin();
      return logOccurrences(validate(zFingerprint, fingerprint));
    },
  },
  Mutation: {
    reportLogs: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const entries = validate(ClientLogsZ, input);
      if (!allowReports(ctx.client.ip ?? 'unknown', entries.length)) {
        throw new GraphQLError('Too many log reports, try again in a minute', { extensions: { code: 'RATE_LIMITED' } });
      }
      return recordClientLogs(entries, ctx.userId, ctx.client);
    },
    adminResolveLogs: async (_: unknown, args: unknown, ctx: Context) => {
      await ctx.admin();
      const { ids, fingerprint, resolved } = validate(LogResolveZ, args);
      const filter = ids?.length ? { _id: { $in: ids } } : { fingerprint };
      const res = await AppLog.updateMany(filter, { $set: { resolved, resolvedAt: resolved ? new Date() : null } });
      return res.modifiedCount;
    },
    adminDeleteLogs: async (_: unknown, { ids }: { ids: unknown }, ctx: Context) => {
      await ctx.admin();
      const res = await AppLog.deleteMany({ _id: { $in: validate(LogIdsZ, ids) } });
      return res.deletedCount;
    },
  },
};
