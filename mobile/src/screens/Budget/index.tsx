import { router } from 'expo-router';
import { useState } from 'react';
import { FiEdit2, FiSettings } from 'react-icons/fi';
import { XStack, YStack } from 'tamagui';
import { AppSheet } from '@/components/AppSheet';
import { MonthPicker } from '@/components/MonthPicker';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import { Card, ErrorState, H2, H3, IconButton, Loading, Muted, Screen, Title } from '@/components/ui';
import { BudgetForm } from '@/forms/budget';
import { useDashboard } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { currentMonth, money } from '@/lib/format';
import { runAsync } from '@/lib/log';
import { canEdit, useTracker } from '@/lib/tracker';
import type { Dashboard, Tracker, User } from '@/lib/types';
import { BudgetHero } from './BudgetHero';
import { CategoryRings } from './CategoryRings';
import { ExpenseSummaryCard, OverviewCard } from './InsightCards';

function BudgetSettingCard({ data, user, tracker }: Readonly<{ data: Dashboard; user: User; tracker: Tracker }>) {
  const [open, setOpen] = useState(false);
  const summary = data.budget ? `${money(data.budget, data.currency, user.locale)} per month` : 'Not set — tracking against income';
  const owner = tracker.role === 'OWNER';
  return (
    <Card>
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1}>
          <H3>Budget</H3>
          <Muted>{owner ? summary : `${summary} · set by ${tracker.owner.name}`}</Muted>
        </YStack>
        {owner ? <IconButton icon={FiEdit2} onPress={() => setOpen(true)} label="Edit budget" /> : null}
      </XStack>
      <AppSheet open={open} onOpenChange={setOpen}>
        <BudgetForm trackerId={tracker.id} currency={data.currency} current={data.budget} onDone={() => setOpen(false)} />
      </AppSheet>
    </Card>
  );
}

function BudgetBody({ data, user, tracker, month }: Readonly<{ data: Dashboard; user: User; tracker: Tracker; month: string }>) {
  return (
    <>
      <BudgetHero data={data} user={user} canAdd={canEdit(tracker.role)} />
      <CategoryRings slices={data.categories} />
      <H2 marginTop={10}>Budget Insights</H2>
      <OverviewCard data={data} user={user} month={month} />
      <ExpenseSummaryCard data={data} user={user} month={month} />
      <BudgetSettingCard data={data} user={user} tracker={tracker} />
    </>
  );
}

/** Monthly Budget (design reference: remaining ring + category rings + insights) */
export default function BudgetScreen() {
  const user = useUser();
  const tracker = useTracker();
  const [month, setMonth] = useState(() => currentMonth(user.timezone));
  const { data, isLoading, error, refetch, isRefetching } = useDashboard(month);
  const retry = runAsync('budget', refetch);

  let body = <ErrorState error={error} onRetry={retry} />;
  if (data) body = <BudgetBody data={data} user={user} tracker={tracker} month={month} />;
  else if (isLoading) body = <Loading />;

  return (
    <Screen refreshing={isRefetching} onRefresh={retry}>
      <XStack alignItems="center" justifyContent="space-between">
        <YStack width={44} />
        <Title fontSize={24}>Monthly Budget</Title>
        <IconButton
          icon={FiSettings}
          plain
          onPress={() => router.push({ pathname: '/settings/trackers/[id]', params: { id: tracker.id } })}
          label="Tracker settings"
        />
      </XStack>
      <XStack justifyContent="center">
        <TrackerSwitcher />
      </XStack>
      <MonthPicker value={month} onChange={setMonth} settings={user} />
      {body}
    </Screen>
  );
}
