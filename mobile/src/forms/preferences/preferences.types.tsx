import { z } from 'zod';
import type { ProfileInput } from '@/gql/graphql';
import type { User } from '@/lib/types';
import { zCurrencyCode, zPersonName } from '../validators';

export const preferencesSchema = z.object({
  name: zPersonName,
  currency: zCurrencyCode,
  timezone: z.string().min(1, 'Pick a time zone'),
  locale: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/, 'Use a BCP 47 locale like en-IN'),
});

export type PreferencesValues = z.infer<typeof preferencesSchema>;

export const preferencesDefaults = (u: User): PreferencesValues => ({
  name: u.name,
  currency: u.currency,
  timezone: u.timezone,
  locale: u.locale,
});

export const toProfileInput = (v: PreferencesValues): ProfileInput => ({
  name: v.name.trim(),
  currency: v.currency,
  timezone: v.timezone,
  locale: v.locale,
});
