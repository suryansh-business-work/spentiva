import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { KeyboardEvent } from 'react';
import { cellSx } from './cells';
import type { Column, Selection } from './types';

interface TableRowsProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  loading: boolean;
  pageSize: number;
  emptyText: string;
  onRowClick?: (row: T) => void;
  selection?: Selection;
}

const SKELETON_ROWS = ['s1', 's2', 's3', 's4', 's5'];

export function TableRows<T extends { id: string }>({
  columns,
  rows,
  loading,
  pageSize,
  emptyText,
  onRowClick,
  selection,
}: Readonly<TableRowsProps<T>>) {
  const span = columns.length + (selection ? 1 : 0);

  if (loading && rows.length === 0) {
    return (
      <TableBody>
        {SKELETON_ROWS.slice(0, Math.min(pageSize, SKELETON_ROWS.length)).map((key) => (
          <TableRow key={key}>
            <TableCell colSpan={span}>
              <Skeleton height={28} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={span} align="center" sx={{ py: 6 }}>
            <Typography color="text.secondary">{emptyText}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  const toggle = (id: string) => {
    if (!selection) return;
    selection.onChange(selection.selected.includes(id) ? selection.selected.filter((s) => s !== id) : [...selection.selected, id]);
  };

  const onKeyDown = (e: KeyboardEvent, row: T) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          hover
          selected={selection?.selected.includes(row.id) ?? false}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          onKeyDown={(e) => onKeyDown(e, row)}
          tabIndex={onRowClick ? 0 : undefined}
          sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
        >
          {selection ? (
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selection.selected.includes(row.id)}
                onChange={() => toggle(row.id)}
                slotProps={{ input: { 'aria-label': 'Select row' } }}
              />
            </TableCell>
          ) : null}
          {columns.map((col) => (
            <TableCell key={col.id} align={col.align} sx={cellSx(col)}>
              {col.render(row)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
