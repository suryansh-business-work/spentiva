import { FiUserX } from 'react-icons/fi';
import { AppSheet } from '@/components/AppSheet';
import { useConfirm } from '@/components/ConfirmDialog';
import { Btn, ErrorText, H2, Muted, Segmented } from '@/components/ui';
import { useRemoveMember, useSetMemberRole } from '@/hooks/trackerMutations';
import { MEMBER_ROLE_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import type { TrackerMember } from '@/lib/types';

type MemberRole = (typeof MEMBER_ROLE_OPTIONS)[number]['value'];

interface MemberSheetProps {
  trackerId: string;
  member: TrackerMember | null;
  onClose: () => void;
}

/** Owner only: switch someone between "can edit" and "view only", or take their access away */
export function MemberSheet({ trackerId, member, onClose }: Readonly<MemberSheetProps>) {
  const confirm = useConfirm();
  const setRole = useSetMemberRole();
  const remove = useRemoveMember();

  const changeRole = (role: MemberRole) => {
    if (!member || role === member.role) return;
    runAsync('member', async () => {
      await setRole.mutateAsync({ id: trackerId, userId: member.user.id, role });
      onClose();
    })();
  };

  const removeMember = runAsync('member', async () => {
    if (!member) return;
    const ok = await confirm({
      title: `Remove ${member.user.name}?`,
      message: 'They lose access to this tracker. Entries they added stay.',
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!ok) return;
    await remove.mutateAsync({ id: trackerId, userId: member.user.id });
    onClose();
  });

  const role = member?.role === 'VIEWER' ? 'VIEWER' : 'EDITOR';
  return (
    <AppSheet
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <H2>{member?.user.name ?? ''}</H2>
      <Muted>{member?.user.email ?? ''}</Muted>
      <Segmented value={role} options={MEMBER_ROLE_OPTIONS} onChange={changeRole} />
      <ErrorText error={setRole.error ?? remove.error} />
      <Btn title="Remove from tracker" variant="danger" icon={FiUserX} onPress={removeMember} loading={remove.isPending} />
    </AppSheet>
  );
}
