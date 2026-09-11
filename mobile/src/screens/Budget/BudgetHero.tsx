import { router } from 'expo-router';
import { FiPlus, FiSun } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { Ring } from '@/components/Ring';
import { IconButton, Muted, Tiny } from '@/components/ui';
import { money } from '@/lib/format';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

/** Big "Remaining" ring with insight + add buttons (design reference) */
export function BudgetHero({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  const base = data.budget ?? data.income;
  const progress = base > 0 ? Math.max(0, data.remaining) / base : 0;
  const over = data.remaining < 0;
  const fmt = (n: number) => money(n, data.currency, user.locale);
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingVertical={8}>
      <IconButton icon={FiSun} onPress={() => router.push('/reports')} label="Insights" />
      <Ring size={210} stroke={20} progress={progress} color={over ? C.red : C.green}>
        <YStack alignItems="center">
          <Muted fontSize={12}>{over ? 'Over by' : 'Remaining'}</Muted>
          <Text fontSize={30} fontWeight="800" color={C.ink} letterSpacing={-1}>
            {fmt(Math.abs(data.remaining))}
          </Text>
          <Tiny>
            of {fmt(base)} {data.budget ? 'budget' : 'income'}
          </Tiny>
        </YStack>
      </Ring>
      <IconButton icon={FiPlus} onPress={() => router.push('/transaction')} label="Add transaction" />
    </XStack>
  );
}
