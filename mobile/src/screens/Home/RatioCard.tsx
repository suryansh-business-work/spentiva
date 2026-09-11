import { Text, XStack, YStack } from 'tamagui';
import { ChangeBadge } from '@/components/Insights';
import { Card, H3, Muted, ProgressBar, Tiny } from '@/components/ui';
import { money } from '@/lib/format';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

function Ratio({ label, value, color, caption }: Readonly<{ label: string; value: number; color: string; caption: string }>) {
  return (
    <YStack gap={6} flex={1}>
      <XStack justifyContent="space-between">
        <Muted>{label}</Muted>
        <Text fontSize={13} fontWeight="700" color={C.ink}>
          {Math.round(value)}%
        </Text>
      </XStack>
      <ProgressBar percent={value} color={color} />
      <Tiny>{caption}</Tiny>
    </YStack>
  );
}

/** Savings rate and expense-to-income ratio */
export function RatioCard({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  const fmt = (n: number) => money(n, data.currency, user.locale);
  const spentColor = data.expenseRatio > 90 ? C.red : C.expense;
  return (
    <Card>
      <XStack alignItems="center" justifyContent="space-between">
        <H3>Income vs expense</H3>
        <ChangeBadge change={data.expenseChange} />
      </XStack>
      <XStack gap={16}>
        <Ratio label="Savings rate" value={Math.max(0, data.savingsRate)} color={C.green} caption={`${fmt(data.savings)} saved`} />
        <Ratio label="Spent of income" value={data.expenseRatio} color={spentColor} caption={`Avg ${fmt(data.avgDailyExpense)}/day`} />
      </XStack>
    </Card>
  );
}
