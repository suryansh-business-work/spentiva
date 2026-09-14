import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { PageLoader } from '@/components/states';
import { UserFiltersForm, toUserFilter, userFiltersToParams, type UserFiltersValues } from '@/forms/user-filters';
import { useRules, useUsers } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { useTableState } from '@/hooks/useTableState';
import { userColumns } from './columns';

/** Everyone using Spentiva: role, account status, app build, last activity, errors */
export default function UsersPage() {
  const display = useDisplay();
  const navigate = useNavigate();
  const rules = useRules();
  const table = useTableState({ by: 'createdAt', dir: 'DESC' });
  const { params, update } = table;

  const filter = useMemo(() => toUserFilter(params), [params]);
  const { data, error, isFetching, refetch } = useUsers(filter, table.pageInput);
  const columns = useMemo(() => userColumns(display), [display]);
  const applyFilters = useCallback((v: UserFiltersValues) => update(userFiltersToParams(v)), [update]);

  if (!rules.data) return <PageLoader />;
  const total = data?.adminUsers.total ?? 0;

  return (
    <>
      <PageHeader title="Users" subtitle={`${total} matching`} />
      <UserFiltersForm rules={rules.data.validationRules} params={params} onApply={applyFilters} />
      <DataTable
        label="Users"
        columns={columns}
        rows={data?.adminUsers.items ?? []}
        total={total}
        page={table.page}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        sort={table.sort}
        onSortChange={table.setSort}
        loading={isFetching}
        error={error}
        onRetry={() => refetch()}
        onRowClick={(u) => navigate(`/users/${u.id}`)}
        emptyText="No users match these filters"
      />
    </>
  );
}
