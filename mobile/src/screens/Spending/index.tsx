import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState, ErrorState, Loading } from '@/components/ui';
import { useCategoryMap, useTransactions } from '@/hooks/queries';
import { useDebounced } from '@/hooks/useDebounced';
import { useUser } from '@/lib/auth';
import { canEdit, useTracker } from '@/lib/tracker';
import { currentMonth, money } from '@/lib/format';
import { runAsync } from '@/lib/log';
import { C } from '@/theme/colors';
import { SpendingFilters, type TypeFilter } from './SpendingFilters';
import { useSections, type DaySection } from './useSections';

const isTypeFilter = (v?: string): v is TypeFilter => v === 'ALL' || v === 'EXPENSE' || v === 'INCOME';

function SectionHeader({ section, currency, locale }: Readonly<{ section: DaySection; currency: string; locale: string }>) {
  const positive = section.net >= 0;
  return (
    <XStack justifyContent="space-between" paddingTop={14} paddingBottom={4}>
      <Text fontSize={13} fontWeight="700" color={C.sub}>
        {section.title}
      </Text>
      <Text fontSize={13} fontWeight="600" color={positive ? C.green : C.sub}>
        {positive ? '+' : '−'}
        {money(Math.abs(section.net), currency, locale)}
      </Text>
    </XStack>
  );
}

function ListFooter({ loading, total }: Readonly<{ loading: boolean; total: number }>) {
  if (loading) return <ActivityIndicator color={C.green} style={{ marginTop: 16 }} />;
  if (total === 0) return null;
  return (
    <Text textAlign="center" color={C.faint} fontSize={12} marginTop={16}>
      {total === 1 ? '1 transaction' : `${total} transactions`}
    </Text>
  );
}

/** All transactions for a month, grouped by day, with search and type filter */
export default function SpendingScreen() {
  const user = useUser();
  const tracker = useTracker();
  // Month + type live in the URL so Home can deep-link (e.g. Income for this month)
  const params = useLocalSearchParams<{ type?: string; month?: string }>();
  const [defaultMonth] = useState(() => currentMonth(user.timezone));
  const month = params.month ?? defaultMonth;
  const type: TypeFilter = isTypeFilter(params.type) ? params.type : 'ALL';
  const setMonth = (next: string) => router.setParams({ month: next });
  const setType = (next: TypeFilter) => router.setParams({ type: next });
  const [search, setSearch] = useState('');
  const q = useDebounced(search);

  const filter = useMemo(() => ({ month, type: type === 'ALL' ? null : type, search: q.trim() || null }), [month, type, q]);
  const list = useTransactions(filter);
  const categories = useCategoryMap();
  const sections = useSections(list.data?.pages.flatMap((p) => p.items) ?? [], user);
  const total = list.data?.pages[0]?.total ?? 0;
  const retry = runAsync('spending', list.refetch);
  const loadMore = runAsync('spending', async () => {
    if (list.hasNextPage && !list.isFetchingNextPage) await list.fetchNextPage();
  });

  let content = <ErrorState error={list.error} onRetry={retry} />;
  if (list.isLoading) content = <Loading />;
  else if (list.data) {
    content = (
      <SectionList
        sections={sections}
        keyExtractor={(tx) => tx.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={list.isRefetching} onRefresh={retry} tintColor={C.green} colors={[C.green]} />}
        renderSectionHeader={({ section }) => <SectionHeader section={section} currency={tracker.currency} locale={user.locale} />}
        renderItem={({ item }) => (
          <YStack backgroundColor={C.white} paddingHorizontal={14} borderRadius={18} marginTop={6} borderWidth={1} borderColor={C.line}>
            <TransactionRow
              tx={item}
              user={user}
              category={item.categoryId ? categories.get(item.categoryId) : undefined}
              onPress={() => router.push({ pathname: '/transaction', params: { id: item.id } })}
            />
          </YStack>
        )}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        ListEmptyComponent={
          <EmptyState
            title={q ? 'No matches' : 'No transactions'}
            message={q ? 'Try a different search.' : 'Log from the chat or tap + to add one.'}
          />
        }
        ListFooterComponent={<ListFooter loading={list.isFetchingNextPage} total={total} />}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <SpendingFilters
        user={user}
        month={month}
        onMonth={setMonth}
        type={type}
        onType={setType}
        search={search}
        onSearch={setSearch}
        canAdd={canEdit(tracker.role)}
      />
      {content}
    </SafeAreaView>
  );
}
