import { z } from 'zod';
import { LOG_LIMITS, RULES } from '../config/rules.js';
import { LOG_LEVELS, LOG_SOURCES } from '../models/AppLog.js';
import { REPORT_FREQUENCIES } from '../models/ReportSchedule.js';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '../models/SupportTicket.js';
import { MEMBER_ROLES, TRACKER_KINDS } from '../models/Tracker.js';
import { EMAIL_PERIODS } from '../services/email/schedules.js';
import { REPORT_KINDS } from '../services/reports/index.js';
import { PERIODS } from '../utils/time.js';
import { zColor, zCurrency, zLocale, zName, zObjectId, zTimeZone } from '../utils/validators.js';

/** zod schemas for every GraphQL input (validated in resolvers) */
const TxTypeZ = z.enum(['EXPENSE', 'INCOME']);
const optional = <T extends z.ZodType>(s: T) => s.nullish();

export const zMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'must be YYYY-MM');

export const SignupZ = z.object({
  name: zName,
  email: z.email('must be a valid email').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(RULES.passwordMin, `must be at least ${RULES.passwordMin} characters`).max(RULES.passwordMax),
  currency: optional(zCurrency),
  timezone: optional(zTimeZone),
  locale: optional(zLocale),
});

export const LoginZ = z.object({ email: z.string().trim().toLowerCase(), password: z.string().min(1, 'is required') });

export const ProfileZ = z.object({
  name: optional(zName),
  currency: optional(zCurrency),
  timezone: optional(zTimeZone),
  locale: optional(zLocale),
  monthlyBudget: z.number().min(0).max(1e12).nullish(),
});

export const PasswordZ = z
  .string()
  .min(RULES.passwordMin, `New password must be at least ${RULES.passwordMin} characters`)
  .max(RULES.passwordMax, 'New password is too long');

export const CategoryZ = z.object({
  name: zName,
  type: TxTypeZ,
  icon: optional(z.string().max(30)),
  color: optional(zColor),
  items: optional(z.array(zName).max(100)),
});

export const CategoryUpdateZ = z.object({ name: optional(zName), icon: optional(z.string().max(30)), color: optional(zColor) });

export const SourceZ = z.object({ name: zName, icon: optional(z.string().max(30)), isDefault: z.boolean().nullish() });

export const TxZ = z.object({
  type: TxTypeZ,
  amount: z.number().positive('must be greater than 0').max(1e12),
  currency: optional(zCurrency),
  categoryId: zObjectId,
  expenseOnId: optional(zObjectId),
  sourceId: optional(zObjectId),
  note: optional(z.string().trim().max(200)),
  occurredAt: z.date().nullish(),
});

export const TxFilterZ = z.object({
  type: TxTypeZ.nullish(),
  month: zMonth.nullish(),
  from: z.date().nullish(),
  to: z.date().nullish(),
  categoryId: optional(zObjectId),
  sourceId: optional(zObjectId),
  search: z.string().trim().max(100).nullish(),
});

export const RangeZ = z.object({ month: zMonth.nullish(), from: z.date().nullish(), to: z.date().nullish() });

export const ReportZ = z.object({
  kind: z.enum(REPORT_KINDS),
  type: TxTypeZ.nullish(),
  period: z.enum(PERIODS).nullish(),
  month: zMonth.nullish(),
  from: z.date().nullish(),
  to: z.date().nullish(),
  categoryId: optional(zObjectId),
  limit: z.number().int().min(1).max(20).nullish(),
});

export const EnvVarsZ = z.array(z.object({ key: z.string().min(1), value: z.string().max(4000).nullish() })).max(20);

/* ---------- Trackers & email reports ---------- */

const zBudget = z.number().min(0).max(1e12).nullish();
const TrackerKindZ = z.enum(TRACKER_KINDS);

export const TrackerZ = z.object({ name: zName, kind: TrackerKindZ, currency: zCurrency, monthlyBudget: zBudget });

export const TrackerUpdateZ = z.object({
  name: optional(zName),
  kind: TrackerKindZ.nullish(),
  currency: optional(zCurrency),
  monthlyBudget: zBudget,
});

/** Owners are set when a tracker is created; people are shared as editors or viewers */
export const MemberRoleZ = z.enum(MEMBER_ROLES, 'Pick Editor or Viewer');

export const ShareZ = z.object({
  email: z.email('must be a valid email').transform((v) => v.toLowerCase().trim()),
  role: MemberRoleZ,
});

export const FrequenciesZ = z.array(z.enum(REPORT_FREQUENCIES)).max(REPORT_FREQUENCIES.length);

export const EmailPeriodZ = z.enum(EMAIL_PERIODS, 'Pick a day, month, quarter or year');

/* ---------- Portal: paging, logs, support, users ---------- */

const zSearch = z.string().trim().max(RULES.searchMax).nullish();
export const zFingerprint = z.string().regex(/^[a-f\d]{40}$/, 'is not a valid fingerprint');

export const PageZ = z.object({
  page: z.number().int().min(0).max(10_000).nullish(),
  pageSize: z.number().int().min(1).max(100).nullish(),
  sortBy: z.string().max(40).nullish(),
  sortDir: z.enum(['ASC', 'DESC']).nullish(),
});

/** Crash reports are never rejected for length — oversized fields are cut instead */
const clipped = (max: number) => z.string().transform((v) => v.slice(0, max));

export const ClientLogsZ = z
  .array(
    z.object({
      level: z.enum(LOG_LEVELS),
      source: z.enum(['APP', 'PORTAL']),
      message: z
        .string()
        .min(1)
        .transform((v) => v.slice(0, LOG_LIMITS.message)),
      stack: clipped(LOG_LIMITS.stack).nullish(),
      url: clipped(LOG_LIMITS.field).nullish(),
      appVersion: clipped(40).nullish(),
      buildNumber: clipped(40).nullish(),
      platform: clipped(40).nullish(),
      osVersion: clipped(40).nullish(),
      device: clipped(LOG_LIMITS.field).nullish(),
      apiUrl: clipped(LOG_LIMITS.field).nullish(),
      context: clipped(LOG_LIMITS.context).nullish(),
      occurredAt: z.date().nullish(),
    }),
  )
  .min(1)
  .max(LOG_LIMITS.batch);

export const LogFilterZ = z
  .object({
    levels: z.array(z.enum(LOG_LEVELS)).max(LOG_LEVELS.length).nullish(),
    source: z.enum(LOG_SOURCES).nullish(),
    resolved: z.boolean().nullish(),
    search: zSearch,
    userId: optional(zObjectId),
    fingerprint: zFingerprint.nullish(),
    appVersion: z.string().trim().max(40).nullish(),
    platform: z.string().trim().max(40).nullish(),
    from: z.date().nullish(),
    to: z.date().nullish(),
  })
  .refine((f) => !f.from || !f.to || f.from <= f.to, { message: 'must be before the end date', path: ['from'] });

export const LogResolveZ = z
  .object({
    ids: z.array(zObjectId).max(100).nullish(),
    fingerprint: zFingerprint.nullish(),
    resolved: z.boolean(),
  })
  .refine((v) => Boolean(v.ids?.length) !== Boolean(v.fingerprint), { message: 'Pass either ids or a fingerprint' });

export const LogIdsZ = z.array(zObjectId).min(1).max(100);

export const TicketZ = z.object({
  subject: z
    .string()
    .trim()
    .min(RULES.ticketSubjectMin, `must be at least ${RULES.ticketSubjectMin} characters`)
    .max(RULES.ticketSubjectMax, 'is too long'),
  category: z.enum(TICKET_CATEGORIES),
  message: z
    .string()
    .trim()
    .min(RULES.ticketMessageMin, `must be at least ${RULES.ticketMessageMin} characters`)
    .max(RULES.ticketMessageMax, 'is too long'),
});

export const TicketReplyZ = z.string().trim().min(1, 'Write a reply first').max(RULES.ticketMessageMax, 'Reply is too long');

export const TicketUpdateZ = z.object({ status: z.enum(TICKET_STATUSES).nullish(), priority: z.enum(TICKET_PRIORITIES).nullish() });

export const TicketFilterZ = z.object({
  status: z.enum(TICKET_STATUSES).nullish(),
  priority: z.enum(TICKET_PRIORITIES).nullish(),
  category: z.enum(TICKET_CATEGORIES).nullish(),
  search: zSearch,
  userId: optional(zObjectId),
});

const RoleZ = z.enum(['USER', 'ADMIN']);

export const UserFilterZ = z.object({ search: zSearch, role: RoleZ.nullish(), disabled: z.boolean().nullish() });

export const UserUpdateZ = z.object({ name: optional(zName), role: RoleZ.nullish(), disabled: z.boolean().nullish() });
