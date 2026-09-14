import type { IconType } from 'react-icons';
import { FiCalendar, FiSend } from 'react-icons/fi';
import { XStack, YStack } from 'tamagui';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import { Card, ErrorState, H3, Header, IconBadge, Loading, Muted, Screen, Tiny } from '@/components/ui';
import { EmailReportsForm } from '@/forms/email-reports';
import { SendReportForm } from '@/forms/send-report';
import { useEmailReports } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import { useTracker } from '@/lib/tracker';
import { C } from '@/theme/colors';

function SectionHead({ icon, title, caption }: Readonly<{ icon: IconType; title: string; caption: string }>) {
  return (
    <XStack alignItems="center" gap={10}>
      <IconBadge icon={icon} color={C.green} size={40} />
      <YStack flex={1}>
        <H3>{title}</H3>
        <Tiny>{caption}</Tiny>
      </YStack>
    </XStack>
  );
}

/** Daily / monthly / quarterly / yearly report emails for the active tracker, plus "send now" */
export default function EmailReportsScreen() {
  const user = useUser();
  const tracker = useTracker();
  const schedules = useEmailReports();

  let scheduled = <ErrorState error={schedules.error} onRetry={runAsync('email-reports', schedules.refetch)} />;
  if (schedules.data) scheduled = <EmailReportsForm key={tracker.id} schedules={schedules.data} settings={user} />;
  else if (schedules.isLoading) scheduled = <Loading />;

  return (
    <Screen>
      <Header title="Email reports" back />
      <TrackerSwitcher />
      <Muted>
        Reports for “{tracker.name}” are emailed to {user.email}: income, spending, savings, top categories, payment modes and the biggest entries.
      </Muted>
      <Card>
        <SectionHead
          icon={FiCalendar}
          title="Scheduled reports"
          caption="Arrive in the morning, your time. Periods with nothing logged are skipped."
        />
        {scheduled}
      </Card>
      <Card>
        <SectionHead icon={FiSend} title="Send a report now" caption="Pick a period and get it in your inbox right away" />
        <SendReportForm key={tracker.id} />
      </Card>
    </Screen>
  );
}
