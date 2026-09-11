import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import type { ReactNode } from 'react';
import type { AdminStatsQuery } from '@/gql/graphql';
import { formatDayKey, type Display } from '@/lib/format';

type Stats = AdminStatsQuery['adminStats'];

const CHART_HEIGHT = 260;

function ChartCard({ title, subtitle, children }: Readonly<{ title: string; subtitle: string; children: ReactNode }>) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

/** Crashes / errors / warnings per day (last 14 days, admin's time zone) */
export function LogsChart({ stats, display }: Readonly<{ stats: Stats; display: Display }>) {
  const days = stats.logsByDay.map((d) => formatDayKey(d.date, display));
  return (
    <ChartCard title="Problems per day" subtitle="Crashes, errors and warnings over the last 14 days">
      <BarChart
        height={CHART_HEIGHT}
        xAxis={[{ scaleType: 'band', data: days }]}
        series={[
          { label: 'Crashes', data: stats.logsByDay.map((d) => d.fatal), stack: 'logs', color: '#D93036' },
          { label: 'Errors', data: stats.logsByDay.map((d) => d.error), stack: 'logs', color: '#ED8B00' },
          { label: 'Warnings', data: stats.logsByDay.map((d) => d.warn), stack: 'logs', color: '#0288D1' },
        ]}
      />
    </ChartCard>
  );
}

export function SignupsChart({ stats, display }: Readonly<{ stats: Stats; display: Display }>) {
  return (
    <ChartCard title="New users" subtitle="Sign-ups per day over the last 14 days">
      <BarChart
        height={CHART_HEIGHT}
        xAxis={[{ scaleType: 'band', data: stats.signupsByDay.map((d) => formatDayKey(d.date, display)) }]}
        series={[{ label: 'Sign-ups', data: stats.signupsByDay.map((d) => d.count), color: '#3F7D0B' }]}
      />
    </ChartCard>
  );
}

/** Which app builds active users run (helps tie a crash to a release) */
export function VersionsChart({ stats }: Readonly<{ stats: Stats }>) {
  const data = stats.appVersions.map((v) => ({ id: v.name, value: v.count, label: v.name === 'unknown' ? 'Unknown' : `v${v.name}` }));
  return (
    <ChartCard title="App versions in use" subtitle="Active users in the last 30 days by app build">
      {data.length ? (
        <PieChart height={CHART_HEIGHT} series={[{ data, innerRadius: 50, paddingAngle: 2, cornerRadius: 4 }]} />
      ) : (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
          No app activity yet
        </Typography>
      )}
    </ChartCard>
  );
}
