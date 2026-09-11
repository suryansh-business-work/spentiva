import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Sort } from '@/hooks/useTableState';
import { cellSx } from './cells';
import type { Column, Selection } from './types';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  rowIds: string[];
  sort?: Sort;
  onSortChange?: (sort: Sort) => void;
  selection?: Selection;
}

function nextSort(sort: Sort | undefined, by: string): Sort {
  if (sort?.by !== by) return { by, dir: 'DESC' };
  return { by, dir: sort.dir === 'DESC' ? 'ASC' : 'DESC' };
}

export function TableHeader<T>({ columns, rowIds, sort, onSortChange, selection }: Readonly<TableHeaderProps<T>>) {
  const selectedOnPage = selection ? rowIds.filter((id) => selection.selected.includes(id)).length : 0;
  const allSelected = rowIds.length > 0 && selectedOnPage === rowIds.length;

  const toggleAll = () => {
    if (!selection) return;
    const others = selection.selected.filter((id) => !rowIds.includes(id));
    selection.onChange(allSelected ? others : [...others, ...rowIds]);
  };

  return (
    <TableHead>
      <TableRow>
        {selection ? (
          <TableCell padding="checkbox">
            <Checkbox
              checked={allSelected}
              indeterminate={selectedOnPage > 0 && !allSelected}
              onChange={toggleAll}
              slotProps={{ input: { 'aria-label': 'Select all rows on this page' } }}
            />
          </TableCell>
        ) : null}
        {columns.map((col) => {
          const active = sort?.by === col.id;
          const direction = active && sort?.dir === 'ASC' ? 'asc' : 'desc';
          return (
            <TableCell key={col.id} align={col.align} sx={cellSx(col)} sortDirection={active ? direction : false}>
              {col.sortable && onSortChange ? (
                <TableSortLabel active={active} direction={direction} onClick={() => onSortChange(nextSort(sort, col.id))}>
                  {col.label}
                </TableSortLabel>
              ) : (
                col.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
