import { z } from 'zod';
import type { EnvFieldsFragment, EnvVarInput } from '@/gql/graphql';

const HOST = /^[a-z\d]([a-z\d-]*[a-z\d])?(\.[a-z\d]([a-z\d-]*[a-z\d])?)+$/i;
const EMAIL = String.raw`[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+`;
/** "reports@example.com" or "Spentiva <reports@example.com>" */
const FROM = new RegExp(String.raw`^(${EMAIL}|[^<>]+<\s*${EMAIL}\s*>)$`);

/** SMTP server for report emails. The password is only required until one is saved (empty keeps it). */
export const smtpSchema = (hasPassword: boolean) =>
  z
    .object({
      host: z.string().trim().min(1, 'Enter the SMTP server').regex(HOST, 'Use a host name like smtp.gmail.com'),
      port: z
        .string()
        .trim()
        .regex(/^\d{1,5}$/, 'Use a port number like 587')
        .refine((v) => Number(v) >= 1 && Number(v) <= 65535, 'Ports go from 1 to 65535'),
      user: z.string().trim().max(200, 'Too long'),
      password: z.string().max(500, 'Too long'),
      from: z.string().trim().min(1, 'Enter the sender address').regex(FROM, 'Use an email, or Name <email>'),
    })
    .superRefine((v, ctx) => {
      if (v.user && !hasPassword && !v.password) ctx.addIssue({ code: 'custom', path: ['password'], message: 'Enter the password for this user' });
    });

export type SmtpValues = z.infer<ReturnType<typeof smtpSchema>>;

type Vars = Map<string, EnvFieldsFragment>;
const saved = (vars: Vars, key: string) => vars.get(key)?.value ?? '';

/** Saved values (the password is never shown, only replaced) */
export const smtpDefaults = (vars: Vars): SmtpValues => ({
  host: saved(vars, 'SMTP_HOST'),
  port: saved(vars, 'SMTP_PORT') || '587',
  user: saved(vars, 'SMTP_USER'),
  password: '',
  from: saved(vars, 'SMTP_FROM'),
});

export const toSmtpEnv = (v: SmtpValues): EnvVarInput[] => [
  { key: 'SMTP_HOST', value: v.host },
  { key: 'SMTP_PORT', value: v.port },
  { key: 'SMTP_USER', value: v.user || null },
  { key: 'SMTP_FROM', value: v.from },
  ...(v.password ? [{ key: 'SMTP_PASSWORD', value: v.password }] : []),
];
