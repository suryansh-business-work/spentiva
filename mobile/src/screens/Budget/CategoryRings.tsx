import { Text, XStack, YStack } from 'tamagui';
import { Ring } from '@/components/Ring';
import { Card, EmptyState } from '@/components/ui';
import type { CategorySlice } from '@/lib/types';
import { C } from '@/theme/colors';

/** Share of spending per category as small rings (Housing 60%, Health 20% …) */
export function CategoryRings({ slices }: Readonly<{ slices: CategorySlice[] }>) {
  if (slices.length === 0) {
    return (
      <Card>
        <EmptyState title="No expenses this month" message="Category rings appear as you log spending." />
      </Card>
    );
  }
  return (
    <XStack flexWrap="wrap" rowGap={18}>
      {slices.slice(0, 9).map((c) => (
        <YStack key={c.categoryId ?? c.name} width="33.33%" alignItems="center" gap={6}>
          <Ring size={70} stroke={6} progress={c.percent / 100} color={c.color}>
            <Text fontSize={13} fontWeight="800" color={C.ink}>
              {Math.round(c.percent)}%
            </Text>
          </Ring>
          <Text fontSize={12} color={C.ink} numberOfLines={1}>
            {c.name}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
}
