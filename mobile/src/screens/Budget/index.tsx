import { router } from 'expo-router';
import { useState } from 'react';
import { FiEdit2, FiSettings } from 'react-icons/fi';
import { XStack, YStack } from 'tamagui';
import { AppSheet } from '@/components/AppSheet';
import { MonthPicker } from '@/components/MonthPicker';
import { Card, ErrorState, H2, H3, IconButton, Loading, Muted, Screen, Title } from '@/components/ui';
import { BudgetForm } from '@/forms/budget';
import { useDashboard } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { currentMonth, money } from '@/lib/format';
import { runAsync } from '@/lib/log';
import type { Dashboard, User } from '@/lib/types';
import { BudgetHero } from './BudgetHero';
import { CategoryRings } from './CategoryRings';
import { ExpenseSummaryCard, OverviewCard } from './InsightCards';

function BudgetSettingCard({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  const [open, setOpen] = useState(false);
  const summary = data.budget ? `${money(data.budget, data.currency, user.locale)} per month` : 'Not set — tracking against income';
  return (
    <Card>
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1}>
          <H3>Budget</H3>
          <Muted>{summary}</Muted>
        </YStack>
        <IconButton icon={FiEdit2} onPress={() => setOpen(true)} label="Edit budget" />
      </XStack>
      <AppSheet open={open} onOpenChange={setOpen}>
        <BudgetForm currency={data.currency} current={data.budget} onDone={() => setOpen(false)} />
      </AppSheet>
    </Card>
  );
}

function BudgetBody({ data, user, month }: Readonly<{ data: Dashboard; user: User; month: string }>) {
  return (
    <>
      <BudgetHero data={data} user={user} />
      <CategoryRings slices={data.categories} />
      <H2 marginTop={10}>Budget Insights</H2>
      <OverviewCard data={data} user={user} month={month} />
      <ExpenseSummaryCard data={data} user={user} month={month} />
      <BudgetSettingCard data={data} user={user} />
    </>
  );
}

/** Monthly Budget (design reference: remaining ring + category rings + insights) */
export default function BudgetScreen() {
  const user = useUser();
  const [month, setMonth] = useState(() => currentMonth(user.timezone));
  const { data, isLoading, error, refetch, isRefetching } = useDashboard(month);
  const retry = runAsync('budget', refetch);

  let body = <ErrorState error={error} onRetry={retry} />;
  if (data) body = <BudgetBody data={data} user={user} month={month} />;
  else if (isLoading) body = <Loading />;

  return (
    <Screen refreshing={isRefetching} onRefresh={retry}>
      <XStack alignItems="center" justifyContent="space-between">
        <YStack width={44} />
        <Title fontSize={24}>Monthly Budget</Title>
        <IconButton icon={FiSettings} plain onPress={() => router.push('/settings/preferences')} label="Budget settings" />
      </XStack>
      <MonthPicker value={month} onChange={setMonth} settings={user} />
      {body}
    </Screen>
  );
}
