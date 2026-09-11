import { router } from 'expo-router';
import { Fragment } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { Card, Divider } from '@/components/ui';
import { money } from '@/lib/format';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

interface RowProps {
  dot: string;
  label: string;
  value: string;
  onPress: () => void;
}

function SummaryRow({ dot, label, value, onPress }: Readonly<RowProps>) {
  return (
    <XStack
      alignItems="center"
      paddingVertical={14}
      gap={10}
      pressStyle={{ opacity: 0.6 }}
      onPress={onPress}
      role="button"
      aria-label={`${label} ${value}`}
    >
      <YStack width={8} height={8} borderRadius={4} backgroundColor={dot} />
      <Text flex={1} fontSize={15} color={C.ink}>
        {label}
      </Text>
      <Text fontSize={16} fontWeight="700" color={C.ink}>
        {value}
      </Text>
      <Icon as={FiChevronRight} size={18} color={C.ink} />
    </XStack>
  );
}

/** Income / Expense / Left for saving (tap to drill in) */
export function SummaryCard({ data, user, month }: Readonly<{ data: Dashboard; user: User; month: string }>) {
  const fmt = (n: number) => money(n, data.currency, user.locale);
  const rows: RowProps[] = [
    {
      dot: C.green,
      label: 'Income',
      value: fmt(data.income),
      onPress: () => router.push({ pathname: '/spending', params: { type: 'INCOME', month } }),
    },
    {
      dot: C.red,
      label: 'Expense',
      value: fmt(data.expense),
      onPress: () => router.push({ pathname: '/spending', params: { type: 'EXPENSE', month } }),
    },
    { dot: C.sub, label: 'Left for saving', value: fmt(data.savings), onPress: () => router.push('/reports') },
  ];
  return (
    <Card paddingVertical={4} gap={0}>
      {rows.map((row, i) => (
        <Fragment key={row.label}>
          {i > 0 ? <Divider /> : null}
          <SummaryRow {...row} />
        </Fragment>
      ))}
    </Card>
  );
}
