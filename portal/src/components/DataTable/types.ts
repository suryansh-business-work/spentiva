import type { ReactNode } from 'react';
import type { Sort } from '@/hooks/useTableState';

export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** Hidden on screens narrower than this breakpoint (keeps tables readable on phones) */
  hideBelow?: 'sm' | 'md' | 'lg';
}

export interface Selection {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export interface DataTableProps<T extends { id: string }> {
  /** Accessible name of the table */
  label: string;
  columns: Column<T>[];
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sort?: Sort;
  onSortChange?: (sort: Sort) => void;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onRowClick?: (row: T) => void;
  selection?: Selection;
  emptyText: string;
}
