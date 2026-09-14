import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { LevelChip, TicketStatusChip } from '@/components/chips';
import { ErrorAlert } from '@/components/states';
import { useLogs, useTickets } from '@/hooks/queries';
import { timeAgo } from '@/lib/format';

const RECENT = { page: 0, pageSize: 5 };

function Section({ title, action, children }: Readonly<{ title: string; action: ReactNode; children: ReactNode }>) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

const Empty = ({ text }: Readonly<{ text: string }>) => (
  <Typography color="text.secondary" sx={{ py: 3 }}>
    {text}
  </Typography>
);

/** The user's latest crashes / errors (links into Logs) */
export function UserLogs({ userId }: Readonly<{ userId: string }>) {
  const { data, error } = useLogs({ userId }, RECENT);
  const items = data?.adminLogs.items ?? [];
  return (
    <Section
      title="Recent problems"
      action={
        <Button component={Link} to={`/logs?userId=${userId}`} size="small">
          All logs
        </Button>
      }
    >
      <ErrorAlert error={error} />
      {items.length === 0 ? <Empty text="No crashes or errors from this user" /> : null}
      <List dense>
        {items.map((l) => (
          <ListItemButton key={l.id} component={Link} to={`/logs?userId=${userId}&log=${l.id}`} sx={{ borderRadius: 2 }}>
            <ListItemText
              primary={l.message}
              slotProps={{ primary: { noWrap: true } }}
              secondary={
                <Stack component="span" direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                  <LevelChip level={l.level} />
                  <span>{`${l.url ?? ''} · ${timeAgo(l.occurredAt)}`}</span>
                </Stack>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Section>
  );
}

/** The user's support requests */
export function UserTickets({ userId }: Readonly<{ userId: string }>) {
  const { data, error } = useTickets({ userId }, { ...RECENT, sortBy: 'lastMessageAt', sortDir: 'DESC' });
  const items = data?.adminTickets.items ?? [];
  return (
    <Section
      title="Support requests"
      action={
        <Button component={Link} to={`/support?userId=${userId}`} size="small">
          All requests
        </Button>
      }
    >
      <ErrorAlert error={error} />
      {items.length === 0 ? <Empty text="No support requests" /> : null}
      <List dense>
        {items.map((t) => (
          <ListItemButton key={t.id} component={Link} to={`/support/${t.id}`} sx={{ borderRadius: 2 }}>
            <ListItemText
              primary={t.subject}
              slotProps={{ primary: { noWrap: true } }}
              secondary={
                <Stack component="span" direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                  <TicketStatusChip status={t.status} />
                  <span>{timeAgo(t.lastMessageAt)}</span>
                </Stack>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Section>
  );
}
