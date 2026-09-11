import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { PriorityChip, TicketStatusChip } from '@/components/chips';
import type { Column } from '@/components/DataTable';
import type { TicketRowFieldsFragment } from '@/gql/graphql';
import { formatDate, timeAgo, type Display } from '@/lib/format';
import { CATEGORY_LABELS } from '@/lib/labels';

export type TicketRow = TicketRowFieldsFragment;

/** Subject · user · category · priority · status · messages · last activity */
export const ticketColumns = (display: Display): Column<TicketRow>[] => [
  {
    id: 'subject',
    label: 'Subject',
    render: (t) => (
      <>
        <Link
          component={RouterLink}
          to={`/support/${t.id}`}
          underline="hover"
          color="inherit"
          sx={{ fontWeight: 600 }}
          onClick={(e) => e.stopPropagation()}
        >
          {t.subject}
        </Link>
        {t.lastAuthor === 'USER' && t.status !== 'CLOSED' ? (
          <Typography variant="caption" color="warning.main" component="div">
            Waiting for a reply
          </Typography>
        ) : null}
      </>
    ),
  },
  {
    id: 'user',
    label: 'User',
    hideBelow: 'sm',
    render: (t) => (
      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
        {t.user?.email ?? 'Deleted user'}
      </Typography>
    ),
  },
  { id: 'category', label: 'Category', hideBelow: 'md', render: (t) => CATEGORY_LABELS[t.category] },
  { id: 'priority', label: 'Priority', sortable: true, hideBelow: 'sm', render: (t) => <PriorityChip priority={t.priority} /> },
  { id: 'status', label: 'Status', sortable: true, render: (t) => <TicketStatusChip status={t.status} /> },
  { id: 'messageCount', label: 'Messages', align: 'right', hideBelow: 'lg', render: (t) => t.messageCount },
  {
    id: 'lastMessageAt',
    label: 'Last activity',
    sortable: true,
    hideBelow: 'md',
    render: (t) => <span title={formatDate(t.lastMessageAt, display)}>{timeAgo(t.lastMessageAt)}</span>,
  },
];
