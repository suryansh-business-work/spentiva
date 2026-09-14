import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { PAGE_SIZES } from '@/config';
import { ErrorAlert } from '../states';
import { TableHeader } from './TableHeader';
import { TableRows } from './TableRows';
import type { DataTableProps } from './types';

export type { Column, DataTableProps, Selection } from './types';

/** Server-paginated MUI table used by every list in the portal (page / size / sort come from the URL) */
export function DataTable<T extends { id: string }>(props: Readonly<DataTableProps<T>>) {
  const { label, columns, rows, total, page, pageSize, onPageChange, onPageSizeChange, sort, onSortChange, loading = false, error, onRetry } = props;

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {loading ? <LinearProgress aria-label="Loading" /> : null}
      {error ? <ErrorAlert error={error} onRetry={onRetry} sx={{ m: 2 }} /> : null}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label={label}>
          <TableHeader columns={columns} rowIds={rows.map((r) => r.id)} sort={sort} onSortChange={onSortChange} selection={props.selection} />
          <TableRows
            columns={columns}
            rows={rows}
            loading={loading}
            pageSize={pageSize}
            emptyText={props.emptyText}
            onRowClick={props.onRowClick}
            selection={props.selection}
          />
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={total > 0 ? Math.min(page, Math.max(0, Math.ceil(total / pageSize) - 1)) : 0}
        rowsPerPage={pageSize}
        rowsPerPageOptions={PAGE_SIZES}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onPageSizeChange(Number.parseInt(e.target.value, 10))}
      />
    </Paper>
  );
}
