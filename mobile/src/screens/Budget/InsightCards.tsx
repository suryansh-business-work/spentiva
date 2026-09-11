import { FiDollarSign, FiSun } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { ChangeBadge, RemainingTile } from '@/components/Insights';
import { Card, H3, Muted, Tiny } from '@/components/ui';
import { formatKey, money } from '@/lib/format';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

interface CardProps {
  data: Dashboard;
  user: User;
  month: string;
}

export function OverviewCard({ data, user, month }: Readonly<CardProps>) {
  const monthName = formatKey(month, user, 'monthName');
  const plural = data.daysLeft === 1 ? '' : 's';
  const headline =
    data.daysLeft > 0 ? `You have ${data.daysLeft} day${plural} until the end of ${monthName}` : `${formatKey(month, user, 'month')} is closed`;
  const caption = data.daysLeft > 0 ? `Total unspent left · ${money(data.dailyAllowance, data.currency, user.locale)}/day` : 'Total unspent';
  return (
    <Card>
      <XStack alignItems="center" gap={8}>
        <Icon as={FiSun} size={18} color={C.ink} />
        <H3>Overview</H3>
      </XStack>
      <Muted>{headline}</Muted>
      <RemainingTile data={data} user={user} caption={caption} />
    </Card>
  );
}

function CompareBar({ label, value, max, color, amount }: Readonly<{ label: string; value: number; max: number; color: string; amount: string }>) {
  return (
    <YStack flex={1} alignItems="center" gap={6}>
      <Tiny color={C.sub}>{amount}</Tiny>
      <YStack width="100%" height={Math.max(8, (value / max) * 80)} borderRadius={14} backgroundColor={color} />
      <Tiny>{label}</Tiny>
    </YStack>
  );
}

/** Expense total with change vs last month and a two-bar comparison */
export function ExpenseSummaryCard({ data, user, month }: Readonly<CardProps>) {
  const fmt = (n: number) => money(n, data.currency, user.locale);
  const max = Math.max(data.expense, data.previousExpense, 1);
  return (
    <Card>
      <XStack alignItems="center" gap={8}>
        <Icon as={FiDollarSign} size={18} color={C.ink} />
        <H3>Expense Summary</H3>
      </XStack>
      <Text fontSize={30} fontWeight="800" color={C.ink} letterSpacing={-1}>
        {fmt(data.expense)}
      </Text>
      {data.expenseChange === null ? <Muted>No spending last month to compare</Muted> : <ChangeBadge change={data.expenseChange} />}
      <XStack height={120} alignItems="flex-end" gap={16} marginTop={6}>
        <CompareBar label="Last month" value={data.previousExpense} max={max} color={C.pill} amount={fmt(data.previousExpense)} />
        <CompareBar label={formatKey(month, user, 'monthAbbr')} value={data.expense} max={max} color={C.limeStrong} amount={fmt(data.expense)} />
      </XStack>
    </Card>
  );
}
