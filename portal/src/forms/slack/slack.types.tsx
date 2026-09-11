import { z } from 'zod';
import type { EnvVarInput, PortalSlackChannelsQuery } from '@/gql/graphql';

type SlackChannel = PortalSlackChannelsQuery['slackChannels'][number];

/**
 * Depends on what the server already has: a token is required until one is saved, and once a
 * token is saved a channel must be picked (the channel list is read with the saved token).
 */
export const slackSchema = (hasToken: boolean) =>
  z
    .object({
      token: z
        .string()
        .trim()
        .refine((v) => v === '' || /^xoxb-[\w-]+$/.test(v), 'Slack bot tokens start with xoxb-'),
      channelId: z.string(),
    })
    .superRefine((v, ctx) => {
      if (!hasToken && !v.token) ctx.addIssue({ code: 'custom', path: ['token'], message: 'Paste the bot token' });
      if (hasToken && !v.channelId) ctx.addIssue({ code: 'custom', path: ['channelId'], message: 'Pick the channel new builds are posted to' });
    });

export type SlackValues = z.infer<ReturnType<typeof slackSchema>>;

export const slackDefaults = (channelId: string | null): SlackValues => ({ token: '', channelId: channelId ?? '' });

export function toSlackEnv(v: SlackValues, channels: Pick<SlackChannel, 'id' | 'name'>[]): EnvVarInput[] {
  const input: EnvVarInput[] = [];
  if (v.token) input.push({ key: 'SLACK_BOT_TOKEN', value: v.token });
  if (v.channelId) {
    input.push(
      { key: 'SLACK_CHANNEL_ID', value: v.channelId },
      { key: 'SLACK_CHANNEL_NAME', value: channels.find((c) => c.id === v.channelId)?.name ?? null },
    );
  }
  return input;
}
