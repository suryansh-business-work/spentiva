import { z } from 'zod';
import type { SignupInput } from '@/gql/graphql';
import { zCurrencyCode, zEmail, zPassword, zPersonName } from '../validators';

export const signupSchema = z
  .object({
    name: zPersonName,
    email: zEmail,
    password: zPassword,
    confirm: z.string().min(1, 'Repeat your password'),
    currency: zCurrencyCode,
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export type SignupValues = z.infer<typeof signupSchema>;

export const signupDefaults = (currency: string): SignupValues => ({ name: '', email: '', password: '', confirm: '', currency });

/** Time zone and locale come from the device (changeable later in Preferences) */
export const toSignupInput = (v: SignupValues, device: { timezone: string; locale: string }): SignupInput => ({
  name: v.name.trim(),
  email: v.email.toLowerCase(),
  password: v.password,
  currency: v.currency,
  timezone: device.timezone,
  locale: device.locale,
});
