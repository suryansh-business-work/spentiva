import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';
import { TransactionRow } from '@/components/TransactionRow';
import { Card, EmptyState, ErrorState, Loading, SectionTitle } from '@/components/ui';
import { useCategoryMap, useDashboard } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { currentMonth } from '@/lib/format';
import { runAsync } from '@/lib/log';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';
import { HomeHero } from './HomeHero';
import { InsightCard } from './InsightCard';
import { RatioCard } from './RatioCard';
import { SummaryCard } from './SummaryCard';
import { TopCategoriesCard } from './TopCategoriesCard';

function RecentCard({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  const categories = useCategoryMap();
  if (data.recent.length === 0) {
    return (
      <Card>
        <EmptyState title="Nothing logged yet" message="Your latest expenses and income show up here." />
      </Card>
    );
  }
  return (
    <Card gap={0} paddingVertical={6}>
      {data.recent.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          user={user}
          category={tx.categoryId ? categories.get(tx.categoryId) : undefined}
          showDate
          onPress={() => router.push({ pathname: '/transaction', params: { id: tx.id } })}
        />
      ))}
    </Card>
  );
}

function DashboardBody({ data, user, month }: Readonly<{ data: Dashboard; user: User; month: string }>) {
  return (
    <>
      <SummaryCard data={data} user={user} month={month} />
      <RatioCard data={data} user={user} />
      <InsightCard data={data} user={user} />
      <SectionTitle title="Top categories" action="Budget" onAction={() => router.push('/budget')} />
      <TopCategoriesCard data={data} user={user} />
      <SectionTitle title="Recent" action="See all" onAction={() => router.push('/spending')} />
      <RecentCard data={data} user={user} />
    </>
  );
}

interface ContentProps {
  data: Dashboard | undefined;
  loading: boolean;
  error: unknown;
  retry: () => void;
  user: User;
  month: string;
}

function HomeContent({ data, loading, error, retry, user, month }: Readonly<ContentProps>) {
  if (data) return <DashboardBody data={data} user={user} month={month} />;
  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }
  return <ErrorState error={error} onRetry={retry} />;
}

/** Home dashboard (design: "My Budget") */
export default function HomeScreen() {
  const user = useUser();
  const [month, setMonth] = useState(() => currentMonth(user.timezone));
  const { data, isLoading, error, refetch, isRefetching } = useDashboard(month);
  const retry = runAsync('home', refetch);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.lime }} edges={['top']}>
      <ScrollView
        style={{ backgroundColor: C.bg }}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={retry} tintColor={C.green} colors={[C.green]} />}
      >
        <HomeHero user={user} month={month} onMonthChange={setMonth} trend={data?.trend} />
        <YStack paddingHorizontal={16} marginTop={-58} gap={14}>
          <HomeContent data={data} loading={isLoading} error={error} retry={retry} user={user} month={month} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
