import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useParams } from 'react-router';
import { AccountChip, RoleChip } from '@/components/chips';
import { DetailList } from '@/components/DetailList';
import { PageHeader } from '@/components/PageHeader';
import { ErrorAlert, PageLoader } from '@/components/states';
import type { AdminUserFieldsFragment } from '@/gql/graphql';
import { useRules, useUser } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { useMe } from '@/lib/auth';
import { formatDate, initials, timeAgo, type Display } from '@/lib/format';
import { UserActions } from './UserActions';
import { UserLogs, UserTickets } from './UserActivity';
import { UserDialogs, type UserDialog } from './UserDialogs';

const facts = (u: AdminUserFieldsFragment, d: Display) => [
  { label: 'Email', value: u.email },
  { label: 'Role', value: <RoleChip role={u.role} /> },
  { label: 'Account', value: <AccountChip disabled={u.disabled} /> },
  { label: 'App build', value: u.appVersion ? `v${u.appVersion} · ${u.platform ?? ''}` : 'Not reported yet' },
  { label: 'Last seen', value: u.lastSeenAt ? `${timeAgo(u.lastSeenAt)} (${formatDate(u.lastSeenAt, d)})` : 'Never' },
  { label: 'Joined', value: formatDate(u.createdAt, d) },
  { label: 'Currency · time zone', value: `${u.currency} · ${u.timezone}` },
  { label: 'Locale', value: u.locale },
  { label: 'Entries logged', value: String(u.transactionCount) },
  { label: 'Errors (30 days)', value: String(u.errorCount) },
];

export default function UserDetailPage() {
  const { id = '' } = useParams();
  const me = useMe();
  const display = useDisplay();
  const rules = useRules();
  const { data, error, isPending, refetch } = useUser(id);
  const [dialog, setDialog] = useState<UserDialog>(null);

  if (isPending || !rules.data) return <PageLoader />;
  const user = data?.adminUser;
  if (!user) return <ErrorAlert error={error ?? new Error('User not found')} onRetry={() => refetch()} />;
  const isSelf = user.id === me.id;

  return (
    <>
      <PageHeader
        title={user.name}
        subtitle={
          <Stack component="span" direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.light' }}>{initials(user.name)}</Avatar>
            <span>{isSelf ? `${user.email} (you)` : user.email}</span>
          </Stack>
        }
        actions={<UserActions user={user} isSelf={isSelf} onEdit={() => setDialog('edit')} onResetPassword={() => setDialog('password')} />}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <DetailList items={facts(user, display)} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3.5 }}>
          <UserLogs userId={user.id} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3.5 }}>
          <UserTickets userId={user.id} />
        </Grid>
      </Grid>
      <UserDialogs open={dialog} onClose={() => setDialog(null)} user={user} rules={rules.data.validationRules} isSelf={isSelf} />
    </>
  );
}
