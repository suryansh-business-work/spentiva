import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface LinkFiltersProps {
  params: URLSearchParams;
  onClear: (key: string) => void;
}

const LABELS: Record<string, (v: string) => string> = {
  userId: () => 'One user',
  fingerprint: () => 'Same error',
  appVersion: (v) => `App v${v}`,
  platform: (v) => `Platform: ${v}`,
};

/** Filters that come from links (a user's logs, "show similar"…), each removable */
export function LinkFilters({ params, onClear }: Readonly<LinkFiltersProps>) {
  const active = Object.keys(LABELS).filter((key) => params.get(key));
  if (active.length === 0) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
      {active.map((key) => (
        <Chip key={key} label={LABELS[key]?.(params.get(key) ?? '')} onDelete={() => onClear(key)} color="primary" variant="outlined" />
      ))}
    </Stack>
  );
}
