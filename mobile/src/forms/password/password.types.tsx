import { z } from 'zod';
import { zPassword } from '../validators';

export const passwordSchema = z
  .object({
    current: z.string().min(1, 'Enter your current password'),
    next: zPassword,
    confirm: z.string().min(1, 'Repeat the new password'),
  })
  .refine((v) => v.next === v.confirm, { path: ['confirm'], message: 'Passwords do not match' })
  .refine((v) => v.next !== v.current, { path: ['next'], message: 'Choose a different password' });

export type PasswordValues = z.infer<typeof passwordSchema>;

export const passwordDefaults: PasswordValues = { current: '', next: '', confirm: '' };
