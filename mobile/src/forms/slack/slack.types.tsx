import { z } from 'zod';

export const slackSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'Paste the bot token')
    .refine((v) => /^xoxb-[\w-]+$/.test(v), 'Slack bot tokens start with xoxb-'),
});

export type SlackValues = z.infer<typeof slackSchema>;

export const slackDefaults: SlackValues = { token: '' };
