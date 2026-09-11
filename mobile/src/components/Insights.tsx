import { FiCalendar, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { money } from '@/lib/format';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';
import { Icon } from './Icon';
import { IconBadge, Tiny } from './ui';

/** Lime "left to spend" tile used on Home and Budget */
export function RemainingTile({ data, user, caption }: Readonly<{ data: Dashboard; user: User; caption: string }>) {
  return (
    <XStack backgroundColor={C.limeSoft} borderRadius={18} padding={14} alignItems="center" gap={12}>
      <IconBadge icon={FiCalendar} color={C.greenDark} size={44} />
      <YStack flex={1}>
        <Text fontSize={20} fontWeight="800" color={C.ink}>
          {money(Math.max(0, data.remaining), data.currency, user.locale)}
        </Text>
        <Tiny color={C.sub}>{caption}</Tiny>
      </YStack>
    </XStack>
  );
}

/** Month-over-month change with an up/down arrow (red when spending grew) */
export function ChangeBadge({ change, suffix = 'vs last month' }: Readonly<{ change: number | null; suffix?: string }>) {
  if (change === null) return null;
  const up = change > 0;
  const color = up ? C.red : C.green;
  const sign = up ? '+' : '';
  return (
    <XStack alignItems="center" gap={4}>
      <Icon as={up ? FiTrendingUp : FiTrendingDown} size={14} color={color} />
      <Text fontSize={12} fontWeight="700" color={color}>
        {`${sign}${Math.round(change)}% ${suffix}`}
      </Text>
    </XStack>
  );
}
