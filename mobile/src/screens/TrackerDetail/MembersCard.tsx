import { Fragment, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { Card, Divider, H3 } from '@/components/ui';
import { TRACKER_ROLE_LABELS } from '@/lib/constants';
import { initials } from '@/lib/format';
import type { Tracker, TrackerMember } from '@/lib/types';
import { C } from '@/theme/colors';
import { MemberSheet } from './MemberSheet';

interface MemberRowProps {
  member: TrackerMember;
  you: boolean;
  onPress?: () => void;
}

function MemberRow({ member, you, onPress }: Readonly<MemberRowProps>) {
  return (
    <XStack alignItems="center" gap={12} paddingVertical={10} pressStyle={onPress ? { opacity: 0.6 } : undefined} onPress={onPress} role="button">
      <YStack width={38} height={38} borderRadius={19} backgroundColor={C.lime} alignItems="center" justifyContent="center">
        <Text fontSize={13} fontWeight="800" color={C.ink}>
          {initials(member.user.name)}
        </Text>
      </YStack>
      <YStack flex={1} gap={2}>
        <Text fontSize={15} fontWeight="600" color={C.ink} numberOfLines={1}>
          {you ? `${member.user.name} (you)` : member.user.name}
        </Text>
        <Text fontSize={12} color={C.sub} numberOfLines={1}>
          {member.user.email}
        </Text>
      </YStack>
      <Text fontSize={12} fontWeight="700" color={member.role === 'VIEWER' ? C.sub : C.greenDark}>
        {TRACKER_ROLE_LABELS[member.role]}
      </Text>
    </XStack>
  );
}

/** Owner + everyone the tracker is shared with; the owner taps someone to change their role or remove them */
export function MembersCard({ tracker, userId }: Readonly<{ tracker: Tracker; userId: string }>) {
  const [editing, setEditing] = useState<TrackerMember | null>(null);
  const manage = tracker.role === 'OWNER';
  return (
    <Card gap={0} paddingVertical={6}>
      <H3 paddingVertical={8}>People · {tracker.members.length}</H3>
      {tracker.members.map((m) => (
        <Fragment key={m.user.id}>
          <Divider />
          <MemberRow member={m} you={m.user.id === userId} onPress={manage && m.role !== 'OWNER' ? () => setEditing(m) : undefined} />
        </Fragment>
      ))}
      {manage ? <MemberSheet trackerId={tracker.id} member={editing} onClose={() => setEditing(null)} /> : null}
    </Card>
  );
}
