import CloseIcon from '@mui/icons-material/Close';
import DeleteOutline from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CodeBlock } from '@/components/CodeBlock';
import { LevelChip, ResolvedChip, SourceChip } from '@/components/chips';
import { useConfirm } from '@/components/ConfirmDialog';
import { useNotify } from '@/components/Notify';
import { ErrorAlert, PageLoader } from '@/components/states';
import { useDeleteLogs, useResolveLogs } from '@/hooks/mutations';
import { useLog } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { LogFacts } from './LogFacts';
import { Occurrences } from './Occurrences';

interface LogDrawerProps {
  id: string | null;
  onClose: () => void;
  onShowSimilar: (fingerprint: string) => void;
}

const pretty = (json: string) => {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
};

/** Everything about one log: message, who / when / where, stack trace, context */
export function LogDrawer({ id, onClose, onShowSimilar }: Readonly<LogDrawerProps>) {
  const display = useDisplay();
  const confirm = useConfirm();
  const notify = useNotify();
  const { data, error, isPending, refetch } = useLog(id);
  const resolve = useResolveLogs();
  const remove = useDeleteLogs();
  const log = data?.adminLog;

  const toggleResolved = () => {
    if (!log) return;
    resolve.mutate({ ids: [log.id], resolved: !log.resolved }, { onError: notify.error });
  };

  const deleteLog = async () => {
    if (!log || !(await confirm({ title: 'Delete this log?', confirmLabel: 'Delete', destructive: true }))) return;
    remove.mutate({ ids: [log.id] }, { onSuccess: onClose, onError: notify.error });
  };

  return (
    <Drawer anchor="right" open={Boolean(id)} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 600 } } } }}>
      <Stack spacing={2} sx={{ p: { xs: 2, sm: 3 } }} role="region" aria-label="Log details">
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {log ? <LevelChip level={log.level} /> : null}
          {log ? <SourceChip source={log.source} /> : null}
          {log ? <ResolvedChip resolved={log.resolved} /> : null}
          <IconButton onClick={onClose} aria-label="Close log details" sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {isPending && Boolean(id) ? <PageLoader /> : null}
        <ErrorAlert error={error} onRetry={() => refetch()} />
        {log ? (
          <>
            <Typography variant="h2" component="h2" sx={{ wordBreak: 'break-word' }}>
              {log.message}
            </Typography>
            <Occurrences fingerprint={log.fingerprint} display={display} onShowAll={() => onShowSimilar(log.fingerprint)} />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={toggleResolved} loading={resolve.isPending}>
                {log.resolved ? 'Reopen' : 'Mark resolved'}
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutline />}
                loading={remove.isPending}
                onClick={() => {
                  deleteLog().catch(notify.error);
                }}
              >
                Delete
              </Button>
            </Stack>
            <Divider />
            <LogFacts log={log} display={display} />
            {log.stack ? <CodeBlock label="Stack trace" code={log.stack} /> : null}
            {log.context ? <CodeBlock label="Context" code={pretty(log.context)} /> : null}
            <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              Fingerprint {log.fingerprint}
            </Typography>
          </>
        ) : null}
      </Stack>
    </Drawer>
  );
}
