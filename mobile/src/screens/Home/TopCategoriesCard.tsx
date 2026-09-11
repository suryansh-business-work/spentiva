import { FiMessageCircle } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { iconFor } from '@/components/icons';
import { Card, EmptyState, IconBadge, ProgressBar } from '@/components/ui';
import { money } from '@/lib/format';
import type { CategorySlice, Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

function SliceRow({ slice, amount }: Readonly<{ slice: CategorySlice; amount: string }>) {
  return (
    <XStack alignItems="center" gap={12} paddingVertical={8}>
      <IconBadge icon={iconFor(slice.icon)} color={slice.color} size={38} />
      <YStack flex={1} gap={6}>
        <XStack justifyContent="space-between">
          <Text fontSize={14} fontWeight="600" color={C.ink}>
            {slice.name}
          </Text>
          <Text fontSize={14} fontWeight="700" color={C.ink}>
            {amount}
          </Text>
        </XStack>
        <ProgressBar percent={slice.percent} color={slice.color} height={6} />
      </YStack>
    </XStack>
  );
}

export function TopCategoriesCard({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  return (
    <Card gap={4}>
      {data.categories.length === 0 ? (
        <EmptyState title="No spending yet" message="Log an expense from the chat — e.g. “spent 120 on coffee”." icon={FiMessageCircle} />
      ) : (
        data.categories
          .slice(0, 5)
          .map((s) => <SliceRow key={s.categoryId ?? s.name} slice={s} amount={money(s.amount, data.currency, user.locale)} />)
      )}
    </Card>
  );
}
