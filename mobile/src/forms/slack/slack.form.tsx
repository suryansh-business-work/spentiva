import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiHash } from 'react-icons/fi';
import { XStack, YStack } from 'tamagui';
import { SelectField, TextField } from '@/components/form';
import { Btn, ErrorText, Success } from '@/components/ui';
import { useSaveEnvVars, useTestSlack } from '@/hooks/mutations';
import { useSlackChannels } from '@/hooks/queries';
import { runAsync } from '@/lib/log';
import type { EnvVar } from '@/lib/types';
import { slackDefaults, slackSchema, type SlackValues } from './slack.types';

interface SlackFormProps {
  token?: EnvVar;
  channelId?: EnvVar;
  channelName?: EnvVar;
}

/** Slack bot token + the channel where CI posts new builds (admin) */
export function SlackForm({ token, channelId, channelName }: Readonly<SlackFormProps>) {
  const ready = !!token?.isSet;
  const save = useSaveEnvVars();
  const test = useTestSlack();
  const channels = useSlackChannels(ready);
  const { control, handleSubmit, reset } = useForm<SlackValues>({ resolver: zodResolver(slackSchema), defaultValues: slackDefaults });

  const items = useMemo(
    () =>
      (channels.data ?? []).map((c) => ({
        value: c.id,
        label: `${c.isPrivate ? 'private' : '#'} ${c.name}`,
        subtitle: c.isMember ? 'Bot is a member' : 'Invite the bot first: /invite @YourBot',
      })),
    [channels.data],
  );

  const submit = runAsync(
    'slack',
    handleSubmit(async (v) => {
      await save.mutateAsync({ input: [{ key: 'SLACK_BOT_TOKEN', value: v.token }] });
      reset(slackDefaults);
    }),
  );
  const pickChannel = (id: string) =>
    runAsync('slack', () =>
      save.mutateAsync({
        input: [
          { key: 'SLACK_CHANNEL_ID', value: id },
          { key: 'SLACK_CHANNEL_NAME', value: channels.data?.find((c) => c.id === id)?.name ?? null },
        ],
      }),
    )();
  const runTest = runAsync('slack', () => test.mutateAsync({}));
  const removeToken = runAsync('slack', () => save.mutateAsync({ input: [{ key: 'SLACK_BOT_TOKEN', value: null }] }));

  const current = channelName?.value ?? channelId?.value;

  return (
    <YStack gap={12}>
      <TextField
        control={control}
        name="token"
        label="Bot token"
        placeholder={ready ? 'Enter a new token to replace' : 'xoxb-…'}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        hint="Scopes: chat:write, files:write, channels:read (+ groups:read for private channels)"
      />
      <Btn title="Save token" onPress={submit} loading={save.isPending} height={48} />
      <SelectField
        label="Channel for builds"
        title="Slack channel"
        value={channelId?.value}
        display={current ? `#${current}` : null}
        placeholder={ready ? 'Select a channel' : 'Save a bot token first'}
        items={items}
        onChange={pickChannel}
        disabled={!ready}
        searchable
        icon={FiHash}
      />
      <ErrorText error={save.error ?? channels.error} />
      <XStack gap={10}>
        <Btn title="Send test message" variant="ghost" flex={1} height={46} onPress={runTest} loading={test.isPending} disabled={!current} />
        {token?.source === 'APP' ? <Btn title="Remove token" variant="danger" flex={1} height={46} onPress={removeToken} /> : null}
      </XStack>
      {test.isSuccess ? <Success>Test message sent</Success> : <ErrorText error={test.error} />}
    </YStack>
  );
}
