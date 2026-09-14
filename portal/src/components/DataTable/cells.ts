import type { Column } from './types';

const DISPLAY = { sm: { xs: 'none', sm: 'table-cell' }, md: { xs: 'none', md: 'table-cell' }, lg: { xs: 'none', lg: 'table-cell' } } as const;

/** sx for a cell of this column (width + responsive hiding) */
export const cellSx = <T>(col: Column<T>) => ({
  width: col.width,
  ...(col.hideBelow && { display: DISPLAY[col.hideBelow] }),
});
