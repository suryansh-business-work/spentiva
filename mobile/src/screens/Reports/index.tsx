import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { FiMessageCircle } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { ReportView } from '@/components/ReportView';
import { Card, Chip, ErrorState, H2, Loading, Muted, Screen, Segmented, Title } from '@/components/ui';
import { useReport } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { PERIODS, REPORT_KINDS, TX_TYPE_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import type { Period, ReportKind, TxType } from '@/lib/types';
import { C } from '@/theme/colors';

const SHORT_PERIODS = new Set<Period>(['THIS_WEEK', 'THIS_MONTH', 'LAST_MONTH']);

interface ChipRowProps<T extends string> {
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

function ChipRow<T extends string>({ items, value, onChange }: Readonly<ChipRowProps<T>>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      style={{ marginHorizontal: -16, paddingLeft: 16, flexGrow: 0 }}
    >
      {items.map((i) => (
        <Chip key={i.value} label={i.label} selected={i.value === value} onPress={() => onChange(i.value)} />
      ))}
    </ScrollView>
  );
}

function AskChatHint() {
  return (
    <XStack
      backgroundColor={C.limeSoft}
      borderRadius={20}
      padding={14}
      gap={12}
      alignItems="center"
      pressStyle={{ opacity: 0.7 }}
      onPress={() => router.push('/chat')}
      role="button"
    >
      <Icon as={FiMessageCircle} size={20} color={C.greenDark} />
      <Text flex={1} fontSize={13} color={C.ink}>
        Ask the chat anything — “top spending last month”, “daily food expense this week”, “income vs expense this year”.
      </Text>
    </XStack>
  );
}

/** Reports explorer: every report kind × period, rendered with Chart.js */
export default function ReportsScreen() {
  const user = useUser();
  const [kind, setKind] = useState<ReportKind>('CATEGORY');
  const [period, setPeriod] = useState<Period>('THIS_MONTH');
  const [type, setType] = useState<TxType>('EXPENSE');
  const both = kind === 'INCOME_VS_EXPENSE';
  // Month-wise charts need more than one month
  const effectivePeriod: Period = kind === 'MONTHLY' && SHORT_PERIODS.has(period) ? 'LAST_6_MONTHS' : period;
  const { data, isLoading, error, refetch, isRefetching, isFetching } = useReport({ kind, period: effectivePeriod, type: both ? null : type });
  const retry = runAsync('reports', refetch);

  let body = <ErrorState error={error} onRetry={retry} />;
  if (data) {
    body = (
      <YStack gap={12} opacity={isFetching ? 0.6 : 1}>
        <YStack>
          <H2>{data.title}</H2>
          <Muted>{data.subtitle}</Muted>
        </YStack>
        <ReportView report={data} locale={user.locale} height={250} />
      </YStack>
    );
  } else if (isLoading) {
    body = <Loading />;
  }

  return (
    <Screen refreshing={isRefetching} onRefresh={retry}>
      <Title>Reports</Title>
      <ChipRow items={REPORT_KINDS} value={kind} onChange={setKind} />
      <ChipRow items={PERIODS} value={effectivePeriod} onChange={setPeriod} />
      {both ? null : <Segmented value={type} onChange={setType} options={TX_TYPE_OPTIONS} />}
      <Card>{body}</Card>
      <AskChatHint />
    </Screen>
  );
}
