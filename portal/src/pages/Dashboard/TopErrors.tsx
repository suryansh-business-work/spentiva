import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import { LevelChip, SourceChip } from '@/components/chips';
import type { AdminStatsQuery } from '@/gql/graphql';
import { timeAgo } from '@/lib/format';

type TopError = AdminStatsQuery['adminStats']['topErrors'][number];

/** The unresolved crashes / errors that happened most in the last 7 days */
export function TopErrors({ errors }: Readonly<{ errors: TopError[] }>) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h3" component="h2">
          Top problems
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unresolved crashes and errors, last 7 days
        </Typography>
        {errors.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Nothing to fix right now
          </Typography>
        ) : (
          <List dense>
            {errors.map((e) => (
              <ListItemButton key={e.fingerprint} component={Link} to={`/logs?fingerprint=${e.fingerprint}&log=${e.logId}`} sx={{ borderRadius: 2 }}>
                <ListItemText
                  primary={e.message}
                  slotProps={{ primary: { noWrap: true } }}
                  secondary={
                    <Stack component="span" direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
                      <LevelChip level={e.level} />
                      <SourceChip source={e.source} />
                      <span>{`${e.count}× · ${e.users} user${e.users === 1 ? '' : 's'} · ${timeAgo(e.lastAt)}`}</span>
                    </Stack>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
