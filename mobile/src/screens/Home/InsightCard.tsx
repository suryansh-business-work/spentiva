import { FiSun } from 'react-icons/fi';
import { XStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { RemainingTile } from '@/components/Insights';
import { Card, H3, Muted } from '@/components/ui';
import type { Dashboard, User } from '@/lib/types';
import { C } from '@/theme/colors';

export function InsightCard({ data, user }: Readonly<{ data: Dashboard; user: User }>) {
  const basis = data.budget ? 'Left in your monthly budget' : 'Unspent from income';
  const days = data.daysLeft > 0 ? ` · ${data.daysLeft} days left` : '';
  return (
    <Card>
      <XStack alignItems="center" gap={8}>
        <Icon as={FiSun} size={18} color={C.ink} />
        <H3>Insight</H3>
      </XStack>
      {data.insight ? <Muted>{data.insight}</Muted> : null}
      <RemainingTile data={data} user={user} caption={`${basis}${days}`} />
    </Card>
  );
}
