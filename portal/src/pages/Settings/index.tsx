import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { DetailList } from '@/components/DetailList';
import { PageHeader } from '@/components/PageHeader';
import { ErrorAlert, PageLoader } from '@/components/states';
import { API_URL, APP_VERSION } from '@/config';
import { DisplayForm } from '@/forms/display';
import { OpenAiForm } from '@/forms/openai';
import { SlackForm } from '@/forms/slack';
import { useEnvVars, useTimeZones } from '@/hooks/queries';

function Section({ title, subtitle, children }: Readonly<{ title: string; subtitle: string; children: ReactNode }>) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

/** Portal display preferences + app-wide environment (OpenAI, Slack) */
export default function SettingsPage() {
  const env = useEnvVars();
  const zones = useTimeZones();

  if (env.isPending || zones.isPending) return <PageLoader />;
  const vars = new Map((env.data?.envVars ?? []).map((v) => [v.key, v]));

  return (
    <>
      <PageHeader title="Settings" subtitle="Changes apply to the app and the API right away" />
      <ErrorAlert error={env.error ?? zones.error} sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Display" subtitle="Time zone and locale used for dates and numbers in this portal">
            <DisplayForm timeZones={zones.data?.timeZones ?? []} />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="About" subtitle="Where this portal points">
            <DetailList
              items={[
                { label: 'Portal version', value: `v${APP_VERSION}` },
                { label: 'API', value: API_URL },
              ]}
            />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="OpenAI" subtitle="Parses chat messages into entries (stored encrypted)">
            <OpenAiForm apiKey={vars.get('OPENAI_API_KEY')} model={vars.get('OPENAI_MODEL')} />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Slack" subtitle="New app builds are posted to this channel">
            <SlackForm token={vars.get('SLACK_BOT_TOKEN')} channelId={vars.get('SLACK_CHANNEL_ID')} channelName={vars.get('SLACK_CHANNEL_NAME')} />
          </Section>
        </Grid>
      </Grid>
    </>
  );
}
