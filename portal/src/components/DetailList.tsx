import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface Detail {
  label: string;
  value: ReactNode;
}

/** Label / value pairs (two columns on wide screens, stacked on phones) */
export function DetailList({ items }: Readonly<{ items: Detail[] }>) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' }, columnGap: 2, rowGap: 1 }}>
      {items.map((item) => (
        <Box key={item.label} sx={{ display: 'contents' }}>
          <Typography component="dt" variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography component="dd" variant="body2" sx={{ m: 0, mb: { xs: 1, sm: 0 }, wordBreak: 'break-word' }}>
            {item.value ?? '—'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
