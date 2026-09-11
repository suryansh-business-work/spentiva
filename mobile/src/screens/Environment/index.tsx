import { useMemo } from 'react';
import type { IconType } from 'react-icons';
import { FiCpu, FiLock, FiSlack } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { Card, EmptyState, ErrorState, H3, Header, IconBadge, Loading, Muted, Screen, Tiny } from '@/components/ui';
import { OpenAiForm } from '@/forms/openai';
import { SlackForm } from '@/forms/slack';
import { useEnvVars } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import type { EnvSource, EnvVar } from '@/lib/types';
import { C, tint } from '@/theme/colors';

const SOURCE_LABEL: Record<EnvSource, { text: string; color: string }> = {
  APP: { text: 'Set in app', color: C.green },
  SERVER_ENV: { text: 'From server env / GitHub secret', color: '#3B82F6' },
  NONE: { text: 'Not set', color: C.red },
};

function SourceBadge({ variable }: Readonly<{ variable?: EnvVar }>) {
  const { text, color } = SOURCE_LABEL[variable?.source ?? 'NONE'];
  const suffix = variable?.value ? ` · ${variable.value}` : '';
  return (
    <YStack alignSelf="flex-start" backgroundColor={tint(color, 0.12)} borderRadius={999} paddingHorizontal={10} paddingVertical={3}>
      <Text fontSize={11} fontWeight="700" color={color}>
        {`${text}${suffix}`}
      </Text>
    </YStack>
  );
}

function SectionHead({ icon, color, title, caption }: Readonly<{ icon: IconType; color: string; title: string; caption: string }>) {
  return (
    <XStack alignItems="center" gap={10}>
      <IconBadge icon={icon} color={color} size={40} />
      <YStack flex={1}>
        <H3>{title}</H3>
        <Tiny>{caption}</Tiny>
      </YStack>
    </XStack>
  );
}

/** Admin: OpenAI + Slack settings that override the server env (GitHub Actions secrets) */
export default function EnvironmentScreen() {
  const user = useUser();
  const env = useEnvVars(user.isAdmin);
  const vars = useMemo(() => new Map((env.data ?? []).map((v) => [v.key, v])), [env.data]);

  if (!user.isAdmin) {
    return (
      <Screen>
        <Header title="Environment" back />
        <EmptyState icon={FiLock} title="Admins only" message="Ask the workspace admin to change OpenAI or Slack settings." />
      </Screen>
    );
  }

  let body = <ErrorState error={env.error} onRetry={runAsync('env', env.refetch)} />;
  if (env.isLoading) body = <Loading />;
  else if (env.data) {
    body = (
      <>
        <Card>
          <SectionHead icon={FiCpu} color="#8B5CF6" title="OpenAI" caption="Parses chat messages into expenses & reports" />
          <SourceBadge variable={vars.get('OPENAI_API_KEY')} />
          <OpenAiForm apiKey={vars.get('OPENAI_API_KEY')} model={vars.get('OPENAI_MODEL')} />
        </Card>
        <Card>
          <SectionHead icon={FiSlack} color="#E01E5A" title="Slack" caption="New APK / AAB / IPA builds are posted to this channel" />
          <SourceBadge variable={vars.get('SLACK_BOT_TOKEN')} />
          <SlackForm token={vars.get('SLACK_BOT_TOKEN')} channelId={vars.get('SLACK_CHANNEL_ID')} channelName={vars.get('SLACK_CHANNEL_NAME')} />
        </Card>
        <Tiny textAlign="center">MongoDB URI, JWT secret, Google Drive & signing keys stay in GitHub Actions secrets (see README → Secrets).</Tiny>
      </>
    );
  }

  return (
    <Screen>
      <Header title="Environment variables" back />
      <Muted>Values saved here override the server defaults (GitHub Actions secrets). Secrets are stored encrypted and only shown masked.</Muted>
      {body}
    </Screen>
  );
}
