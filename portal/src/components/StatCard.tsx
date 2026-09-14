import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: 'default' | 'danger';
  to?: string;
}

function StatBody({ label, value, hint, icon, tone }: Readonly<Omit<StatCardProps, 'to'>>) {
  return (
    <CardContent>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h2" component="p" sx={{ mt: 0.5, color: tone === 'danger' ? 'error.main' : 'text.primary' }}>
            {value}
          </Typography>
          {hint ? (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          ) : null}
        </div>
        <Stack sx={{ color: tone === 'danger' ? 'error.main' : 'primary.main' }}>{icon}</Stack>
      </Stack>
    </CardContent>
  );
}

/** Dashboard KPI (links to the matching list when `to` is set) */
export function StatCard({ to, ...body }: Readonly<StatCardProps>) {
  return (
    <Card sx={{ height: '100%' }}>
      {to ? (
        <CardActionArea component={Link} to={to} sx={{ height: '100%' }}>
          <StatBody {...body} />
        </CardActionArea>
      ) : (
        <StatBody {...body} />
      )}
    </Card>
  );
}
