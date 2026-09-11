import { createHash } from 'node:crypto';
import type { z } from 'zod';
import { LOG_LIMITS } from '../config/rules.js';
import type { ClientInfo } from '../graphql/client.js';
import type { ClientLogsZ, LogFilterZ } from '../graphql/inputs.js';
import { AppLog } from '../models/AppLog.js';
import { User } from '../models/User.js';
import { escapeRegex } from '../utils/validators.js';

type ClientLog = z.infer<typeof ClientLogsZ>[number];
type LogFilter = z.infer<typeof LogFilterZ>;

/** Same error → same fingerprint: where it came from + message + first stack frame, numbers blanked */
export function fingerprint(source: string, message: string, stack?: string | null): string {
  const frame = stack?.split('\n').find((line) => line.trim().startsWith('at ')) ?? '';
  const text = `${source}|${message}|${frame.trim()}`.replaceAll(/\d+/g, '#');
  return createHash('sha1').update(text).digest('hex');
}

const emailOf = async (userId: string | null) => (userId ? ((await User.findById(userId, { email: 1 }).lean())?.email ?? null) : null);

/** Logs sent by the app / portal (reportLogs). The user comes from the token, never from the payload. */
export async function recordClientLogs(entries: ClientLog[], userId: string | null, client: ClientInfo): Promise<number> {
  const userEmail = await emailOf(userId);
  const now = new Date();
  await AppLog.insertMany(
    entries.map((e) => ({
      ...e,
      occurredAt: e.occurredAt ?? now,
      userId,
      userEmail,
      ip: client.ip,
      userAgent: client.userAgent,
      fingerprint: fingerprint(e.source, e.message, e.stack),
    })),
  );
  return entries.length;
}

const describe = (err: unknown): Error => {
  if (err instanceof Error) return err;
  return new Error(typeof err === 'string' ? err : JSON.stringify(err));
};

/** Unexpected API failure (bug, database, OpenAI…) → Logs, tagged with the operation and the caller */
export function recordServerError(err: unknown, operation: string, userId: string | null, client: ClientInfo | null): void {
  const error = describe(err);
  const message = (error.message || error.name).slice(0, LOG_LIMITS.message);
  emailOf(userId)
    .then((userEmail) =>
      AppLog.create({
        level: 'ERROR',
        source: 'API',
        message,
        stack: error.stack?.slice(0, LOG_LIMITS.stack) ?? null,
        url: operation,
        userId,
        userEmail,
        platform: 'server',
        appVersion: process.env.APP_VERSION ?? null,
        ip: client?.ip ?? null,
        userAgent: client?.userAgent ?? null,
        context: client?.platform ? JSON.stringify({ callerPlatform: client.platform, callerVersion: client.appVersion }) : null,
        fingerprint: fingerprint('API', message, error.stack),
        occurredAt: new Date(),
      }),
    )
    .catch((e: unknown) => console.error('Could not record API error', e));
}

/** Mongo filter for the portal's Logs table */
export function logQuery(f: LogFilter): Record<string, unknown> {
  const q: Record<string, unknown> = {};
  if (f.levels?.length) q.level = { $in: f.levels };
  if (f.source) q.source = f.source;
  if (typeof f.resolved === 'boolean') q.resolved = f.resolved;
  if (f.userId) q.userId = f.userId;
  if (f.fingerprint) q.fingerprint = f.fingerprint;
  if (f.appVersion) q.appVersion = f.appVersion;
  if (f.platform) q.platform = f.platform;
  if (f.from || f.to) q.occurredAt = { ...(f.from && { $gte: f.from }), ...(f.to && { $lte: f.to }) };
  if (f.search) {
    const rx = new RegExp(escapeRegex(f.search), 'i');
    q.$or = [{ message: rx }, { url: rx }, { userEmail: rx }, { device: rx }];
  }
  return q;
}

/** How often an error happened and to how many users */
export async function logOccurrences(fp: string) {
  const [row] = await AppLog.aggregate<{ count: number; users: unknown[]; firstAt: Date; lastAt: Date }>([
    { $match: { fingerprint: fp } },
    { $group: { _id: null, count: { $sum: 1 }, users: { $addToSet: '$userId' }, firstAt: { $min: '$occurredAt' }, lastAt: { $max: '$occurredAt' } } },
  ]);
  if (!row) return null;
  return { count: row.count, users: row.users.filter(Boolean).length, firstAt: row.firstAt, lastAt: row.lastAt };
}
