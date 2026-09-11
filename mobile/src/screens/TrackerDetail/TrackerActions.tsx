import { router } from 'expo-router';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';
import { useConfirm } from '@/components/ConfirmDialog';
import { Btn, ErrorText } from '@/components/ui';
import { useDeleteTracker, useLeaveTracker } from '@/hooks/trackerMutations';
import { runAsync } from '@/lib/log';
import type { Tracker } from '@/lib/types';

/** Delete (owner) or leave (someone it was shared with) */
export function TrackerActions({ tracker }: Readonly<{ tracker: Tracker }>) {
  const confirm = useConfirm();
  const remove = useDeleteTracker();
  const leave = useLeaveTracker();
  const owner = tracker.role === 'OWNER';

  const run = runAsync('tracker', async () => {
    const ok = await confirm(
      owner
        ? {
            title: `Delete ${tracker.name}?`,
            message: 'Every entry, category and payment mode in it is deleted, for everyone it is shared with. This cannot be undone.',
            confirmLabel: 'Delete',
            destructive: true,
          }
        : {
            title: `Leave ${tracker.name}?`,
            message: `You'll lose access until ${tracker.owner.name} shares it again. Entries you added stay.`,
            confirmLabel: 'Leave',
            destructive: true,
          },
    );
    if (!ok) return;
    if (owner) await remove.mutateAsync({ id: tracker.id });
    else await leave.mutateAsync({ id: tracker.id });
    router.back();
  });

  return (
    <>
      <ErrorText error={remove.error ?? leave.error} />
      <Btn
        title={owner ? 'Delete tracker' : 'Leave tracker'}
        variant="danger"
        icon={owner ? FiTrash2 : FiLogOut}
        onPress={run}
        loading={remove.isPending || leave.isPending}
      />
    </>
  );
}
