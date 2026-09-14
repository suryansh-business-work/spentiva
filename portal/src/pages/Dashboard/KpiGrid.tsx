import BugReportOutlined from '@mui/icons-material/BugReportOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutlineOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutlined';
import PersonAddAltOutlined from '@mui/icons-material/PersonAddAltOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import Grid from '@mui/material/Grid';
import { StatCard } from '@/components/StatCard';
import type { AdminStatsQuery } from '@/gql/graphql';
import { formatCount } from '@/lib/format';

type Stats = AdminStatsQuery['adminStats'];

export function KpiGrid({ stats, locale }: Readonly<{ stats: Stats; locale: string }>) {
  const n = (v: number) => formatCount(v, locale);
  const cards = [
    { label: 'Users', value: n(stats.users), hint: `${n(stats.newUsers7d)} new in 7 days`, icon: <PeopleOutline />, to: '/users' },
    { label: 'Active users (7 days)', value: n(stats.activeUsers7d), hint: `${n(stats.disabledUsers)} disabled`, icon: <PersonAddAltOutlined /> },
    {
      label: 'Crashes (24 h)',
      value: n(stats.crashes24h),
      hint: 'App closed on the user',
      icon: <BugReportOutlined />,
      to: '/logs?levels=FATAL',
      danger: stats.crashes24h > 0,
    },
    {
      label: 'Unresolved errors',
      value: n(stats.unresolvedErrors),
      hint: `${n(stats.errors24h)} errors in 24 h`,
      icon: <ErrorOutline />,
      to: '/logs?levels=FATAL,ERROR&status=open',
      danger: stats.unresolvedErrors > 0,
    },
    {
      label: 'Open support requests',
      value: n(stats.openTickets),
      hint: 'Open + in progress',
      icon: <SupportAgentOutlined />,
      to: '/support?status=OPEN',
    },
    { label: 'Entries logged (7 days)', value: n(stats.transactions7d), hint: 'Expenses + income', icon: <ReceiptLongOutlined /> },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((c) => (
        <Grid key={c.label} size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard label={c.label} value={c.value} hint={c.hint} icon={c.icon} to={c.to} tone={c.danger ? 'danger' : 'default'} />
        </Grid>
      ))}
    </Grid>
  );
}
