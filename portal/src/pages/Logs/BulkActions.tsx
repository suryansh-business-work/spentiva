import DeleteOutline from '@mui/icons-material/DeleteOutlineOutlined';
import DoneAll from '@mui/icons-material/DoneAll';
import Replay from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useConfirm } from '@/components/ConfirmDialog';
import { useNotify } from '@/components/Notify';
import { useDeleteLogs, useResolveLogs } from '@/hooks/mutations';

interface BulkActionsProps {
  selected: string[];
  onDone: () => void;
}

/** Resolve / reopen / delete the selected logs */
export function BulkActions({ selected, onDone }: Readonly<BulkActionsProps>) {
  const confirm = useConfirm();
  const notify = useNotify();
  const resolve = useResolveLogs();
  const remove = useDeleteLogs();
  const count = selected.length;
  const plural = count === 1 ? 'log' : 'logs';

  const setResolved = (resolved: boolean) =>
    resolve.mutate(
      { ids: selected, resolved },
      {
        onSuccess: () => {
          notify.success(`${count} ${plural} ${resolved ? 'resolved' : 'reopened'}`);
          onDone();
        },
        onError: notify.error,
      },
    );

  const deleteSelected = async () => {
    const ok = await confirm({
      title: `Delete ${count} ${plural}?`,
      message: 'Deleted logs are gone for good. Resolve them instead if you only want them out of the way.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    remove.mutate(
      { ids: selected },
      {
        onSuccess: () => {
          notify.success(`${count} ${plural} deleted`);
          onDone();
        },
        onError: notify.error,
      },
    );
  };

  if (count === 0) return null;
  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'action.selected' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>{`${count} selected`}</Typography>
        <Button startIcon={<DoneAll />} onClick={() => setResolved(true)} loading={resolve.isPending}>
          Mark resolved
        </Button>
        <Button startIcon={<Replay />} onClick={() => setResolved(false)} disabled={resolve.isPending}>
          Reopen
        </Button>
        <Button
          color="error"
          startIcon={<DeleteOutline />}
          loading={remove.isPending}
          onClick={() => {
            deleteSelected().catch(notify.error);
          }}
        >
          Delete
        </Button>
      </Stack>
    </Paper>
  );
}
