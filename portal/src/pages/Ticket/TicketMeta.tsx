import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Link as RouterLink } from 'react-router';
import { DetailList } from '@/components/DetailList';
import { useNotify } from '@/components/Notify';
import type { TicketDetailFieldsFragment, TicketPriority, TicketStatus } from '@/gql/graphql';
import { useUpdateTicket } from '@/hooks/mutations';
import { formatDate, type Display } from '@/lib/format';
import { CATEGORY_LABELS, PRIORITY_LABELS, TICKET_STATUS_LABELS, optionsOf } from '@/lib/labels';

type Ticket = TicketDetailFieldsFragment;

const STATUS_OPTIONS = optionsOf(TICKET_STATUS_LABELS);
const PRIORITY_OPTIONS = optionsOf(PRIORITY_LABELS);

/** Status / priority (saved as soon as they change) + who raised it, from which build */
export function TicketMeta({ ticket, display }: Readonly<{ ticket: Ticket; display: Display }>) {
  const notify = useNotify();
  const update = useUpdateTicket();

  const change = (input: { status?: TicketStatus; priority?: TicketPriority }) =>
    update.mutate({ id: ticket.id, input }, { onSuccess: () => notify.success('Support request updated'), onError: notify.error });

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          label="Status"
          value={ticket.status}
          onChange={(e) => change({ status: e.target.value as TicketStatus })}
          disabled={update.isPending}
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Priority"
          value={ticket.priority}
          onChange={(e) => change({ priority: e.target.value as TicketPriority })}
          disabled={update.isPending}
        >
          {PRIORITY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <DetailList
        items={[
          {
            label: 'User',
            value: ticket.user ? (
              <Link component={RouterLink} to={`/users/${ticket.user.id}`}>
                {`${ticket.user.name} (${ticket.user.email})`}
              </Link>
            ) : (
              'Deleted user'
            ),
          },
          { label: 'Category', value: CATEGORY_LABELS[ticket.category] },
          { label: 'App build', value: ticket.appVersion ? `v${ticket.appVersion} · ${ticket.platform ?? ''}` : null },
          { label: 'Opened', value: formatDate(ticket.createdAt, display) },
          { label: 'Last activity', value: formatDate(ticket.lastMessageAt, display) },
        ]}
      />
    </Stack>
  );
}
