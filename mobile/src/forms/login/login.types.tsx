import { z } from 'zod';
import type { LoginInput } from '@/gql/graphql';
import { zEmail } from '../validators';

export const loginSchema = z.object({
  email: zEmail,
  password: z.string().min(1, 'Password is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const loginDefaults: LoginValues = { email: '', password: '' };

export const toLoginInput = (v: LoginValues): LoginInput => ({ email: v.email.toLowerCase(), password: v.password });
