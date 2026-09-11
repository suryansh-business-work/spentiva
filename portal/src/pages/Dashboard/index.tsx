import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { PageHeader } from '@/components/PageHeader';
import { ErrorAlert, PageLoader } from '@/components/states';
import { useDisplay } from '@/hooks/useDisplay';
import { useStats } from '@/hooks/queries';
import { LogsChart, SignupsChart, VersionsChart } from './Charts';
import { KpiGrid } from './KpiGrid';
import { TopErrors } from './TopErrors';

/** How the app is doing: users, crashes, support load and app versions in use */
export default function DashboardPage() {
  const display = useDisplay();
  const { data, error, refetch, isPending } = useStats();

  if (isPending) return <PageLoader />;
  if (!data) return <ErrorAlert error={error} onRetry={() => refetch()} />;
  const stats = data.adminStats;

  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" subtitle={`Times in ${display.timezone}`} />
      <KpiGrid stats={stats} locale={display.locale} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <LogsChart stats={stats} display={display} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <TopErrors errors={stats.topErrors} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <SignupsChart stats={stats} display={display} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <VersionsChart stats={stats} />
        </Grid>
      </Grid>
    </Stack>
  );
}
