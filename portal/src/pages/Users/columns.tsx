import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { AccountChip, RoleChip } from '@/components/chips';
import type { Column } from '@/components/DataTable';
import type { AdminUserFieldsFragment } from '@/gql/graphql';
import { formatDate, initials, timeAgo, type Display } from '@/lib/format';

export type UserRow = AdminUserFieldsFragment;

const appOf = (u: UserRow) => [u.appVersion ? `v${u.appVersion}` : null, u.platform].filter(Boolean).join(' · ') || '—';

/** Name/email · role · account · app build · last seen · joined · activity counts */
export const userColumns = (display: Display): Column<UserRow>[] => [
  {
    id: 'name',
    label: 'User',
    sortable: true,
    render: (u) => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 200 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'primary.light' }}>{initials(u.name)}</Avatar>
        <div>
          <Link
            component={RouterLink}
            to={`/users/${u.id}`}
            underline="hover"
            color="inherit"
            sx={{ fontWeight: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            {u.name}
          </Link>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ wordBreak: 'break-all' }}>
            {u.email}
          </Typography>
        </div>
      </Stack>
    ),
  },
  { id: 'role', label: 'Role', hideBelow: 'sm', render: (u) => <RoleChip role={u.role} /> },
  { id: 'disabled', label: 'Account', render: (u) => <AccountChip disabled={u.disabled} /> },
  { id: 'app', label: 'App', hideBelow: 'md', render: (u) => appOf(u) },
  {
    id: 'lastSeenAt',
    label: 'Last seen',
    sortable: true,
    hideBelow: 'md',
    render: (u) => (u.lastSeenAt ? <span title={formatDate(u.lastSeenAt, display)}>{timeAgo(u.lastSeenAt)}</span> : 'Never'),
  },
  { id: 'createdAt', label: 'Joined', sortable: true, hideBelow: 'lg', render: (u) => formatDate(u.createdAt, display, 'date') },
  { id: 'transactionCount', label: 'Entries', align: 'right', hideBelow: 'lg', render: (u) => u.transactionCount },
  {
    id: 'errorCount',
    label: 'Errors (30d)',
    align: 'right',
    hideBelow: 'sm',
    render: (u) => <Typography color={u.errorCount > 0 ? 'error.main' : 'text.secondary'}>{u.errorCount}</Typography>,
  },
  { id: 'ticketCount', label: 'Tickets', align: 'right', hideBelow: 'lg', render: (u) => u.ticketCount },
];
