import { z } from 'zod';
import type { RulesFieldsFragment } from '@/gql/graphql';

/** Length limits come from the API's validationRules, so the form matches the server exactly */
export const resetPasswordSchema = (rules: Pick<RulesFieldsFragment, 'passwordMin' | 'passwordMax'>) =>
  z
    .object({
      password: z
        .string()
        .min(rules.passwordMin, `Use at least ${rules.passwordMin} characters`)
        .max(rules.passwordMax, `Use at most ${rules.passwordMax} characters`),
      confirm: z.string().min(1, 'Type the password again'),
    })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: "Passwords don't match" });

export type ResetPasswordValues = z.infer<ReturnType<typeof resetPasswordSchema>>;

export const resetPasswordDefaults: ResetPasswordValues = { password: '', confirm: '' };
