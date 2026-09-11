import { z } from 'zod';
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
  password: z.string().min(6, 'must be at least 6 characters').max(100),
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

export const PasswordZ = z.string().min(6, 'New password must be at least 6 characters');

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
