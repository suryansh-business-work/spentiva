import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { PageInput, SortDirection } from '@/gql/graphql';

export interface Sort {
  by: string;
  dir: SortDirection;
}

const toInt = (value: string | null, fallback: number) => {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

/**
 * Page, page size, sort and filters of a portal table live in the URL, so a reload or a
 * shared link opens exactly the same view. Changing a filter goes back to the first page.
 */
export function useTableState(defaultSort: Sort, defaultPageSize = 25) {
  const [params, setParams] = useSearchParams();

  const page = toInt(params.get('page'), 0);
  const pageSize = toInt(params.get('size'), defaultPageSize) || defaultPageSize;
  const sort: Sort = { by: params.get('sort') ?? defaultSort.by, dir: params.get('dir') === 'ASC' ? 'ASC' : defaultSort.dir };

  const update = useCallback(
    (changes: Record<string, string | null>, keepPage = false) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
          }
          if (!keepPage) next.delete('page');
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  const pageInput: PageInput = useMemo(() => ({ page, pageSize, sortBy: sort.by, sortDir: sort.dir }), [page, pageSize, sort.by, sort.dir]);

  return {
    params,
    page,
    pageSize,
    sort,
    pageInput,
    update,
    setPage: (p: number) => update({ page: p ? String(p) : null }, true),
    setPageSize: (size: number) => update({ size: String(size) }),
    setSort: (s: Sort) => update({ sort: s.by, dir: s.dir }),
  };
}
