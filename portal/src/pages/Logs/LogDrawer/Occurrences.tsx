import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useNotify } from '@/components/Notify';
import { useResolveLogs } from '@/hooks/mutations';
import { useOccurrences } from '@/hooks/queries';
import { formatDate, type Display } from '@/lib/format';

interface OccurrencesProps {
  fingerprint: string;
  display: Display;
  onShowAll: () => void;
}

/** How often this same error happened, to how many users — and resolve them all at once */
export function Occurrences({ fingerprint, display, onShowAll }: Readonly<OccurrencesProps>) {
  const notify = useNotify();
  const { data, isPending } = useOccurrences(fingerprint);
  const resolve = useResolveLogs();

  if (isPending) return <Skeleton height={64} />;
  const o = data?.adminLogOccurrences;
  if (!o) return null;

  const resolveAll = (resolved: boolean) =>
    resolve.mutate(
      { fingerprint, resolved },
      { onSuccess: (r) => notify.success(`${r.adminResolveLogs} ${resolved ? 'resolved' : 'reopened'}`), onError: notify.error },
    );

  return (
    <Alert severity={o.count > 1 ? 'warning' : 'info'} icon={false}>
      <strong>{`Happened ${o.count} time${o.count === 1 ? '' : 's'} to ${o.users} user${o.users === 1 ? '' : 's'}`}</strong>
      <div>{`First ${formatDate(o.firstAt, display)} · last ${formatDate(o.lastAt, display)}`}</div>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
        <Button size="small" variant="outlined" onClick={onShowAll}>
          Show all
        </Button>
        <Button size="small" variant="outlined" onClick={() => resolveAll(true)} loading={resolve.isPending}>
          Resolve all
        </Button>
        <Button size="small" onClick={() => resolveAll(false)} disabled={resolve.isPending}>
          Reopen all
        </Button>
      </Stack>
    </Alert>
  );
}
