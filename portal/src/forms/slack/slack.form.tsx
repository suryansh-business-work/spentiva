import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormSelect, FormTextField } from '@/components/form';
import { useNotify } from '@/components/Notify';
import { ErrorAlert } from '@/components/states';
import type { EnvFieldsFragment, PortalSlackChannelsQuery } from '@/gql/graphql';
import { useSaveEnvVars, useTestSlack } from '@/hooks/mutations';
import { useSlackChannels } from '@/hooks/queries';
import type { Option } from '@/lib/labels';
import { slackDefaults, slackSchema, toSlackEnv, type SlackValues } from './slack.types';

type Channel = PortalSlackChannelsQuery['slackChannels'][number];

const channelLabel = (c: Channel) => {
  const prefix = c.isPrivate ? 'private: ' : '#';
  return c.isMember ? `${prefix}${c.name}` : `${prefix}${c.name} (invite the bot first)`;
};

/** Channels from Slack; the saved channel stays selectable while (or if) that list isn't available */
function channelOptions(list: Channel[], savedId: string | null, savedName: string | null): Option[] {
  const options = list.map((c) => ({ value: c.id, label: channelLabel(c) }));
  if (savedId && !list.some((c) => c.id === savedId)) options.unshift({ value: savedId, label: `#${savedName ?? savedId}` });
  return options;
}

interface SlackFormProps {
  token?: EnvFieldsFragment;
  channelId?: EnvFieldsFragment;
  channelName?: EnvFieldsFragment;
}

/** Slack bot token + the channel CI posts new app builds to */
export function SlackForm({ token, channelId, channelName }: Readonly<SlackFormProps>) {
  const notify = useNotify();
  const hasToken = Boolean(token?.isSet);
  const save = useSaveEnvVars();
  const test = useTestSlack();
  const channels = useSlackChannels(hasToken);
  const schema = useMemo(() => slackSchema(hasToken), [hasToken]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SlackValues>({ resolver: zodResolver(schema), values: slackDefaults(channelId?.value ?? null), mode: 'onChange' });

  const list = channels.data?.slackChannels ?? [];
  const options = channelOptions(list, channelId?.value ?? null, channelName?.value ?? null);

  const submit = handleSubmit(async (v) => {
    await save.mutateAsync({ input: toSlackEnv(v, list) });
    reset(slackDefaults(v.channelId || null));
    notify.success(hasToken ? 'Slack settings saved' : 'Token saved — now pick the channel');
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit}>
      <FormTextField
        control={control}
        name="token"
        label="Bot token"
        type="password"
        autoComplete="off"
        placeholder={hasToken ? `Saved (${token?.value ?? ''}) — type a new token to replace it` : 'xoxb-…'}
        hint="Scopes: chat:write, files:write, channels:read (+ groups:read for private channels)"
      />
      <FormSelect
        control={control}
        name="channelId"
        label="Channel for new builds"
        options={options}
        disabled={!hasToken}
        hint={hasToken ? 'Private channels need the bot invited: /invite @YourBot' : 'Save a bot token first'}
      />
      <ErrorAlert error={save.error ?? channels.error} />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          Save Slack settings
        </Button>
        <Button variant="outlined" onClick={() => test.mutate({})} loading={test.isPending} disabled={!channelId?.isSet}>
          Send test message
        </Button>
      </Stack>
      {test.isSuccess ? <Alert severity="success">Test message sent</Alert> : <ErrorAlert error={test.error} />}
    </Stack>
  );
}
