import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { PageLoader } from '@/components/states';
import { TicketFiltersForm, ticketFiltersToParams, toTicketFilter, type TicketFiltersValues } from '@/forms/ticket-filters';
import { useRules, useTickets } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { useTableState } from '@/hooks/useTableState';
import { ticketColumns } from './columns';

/** Help requests raised from the app (Profile → Help & support) */
export default function SupportPage() {
  const display = useDisplay();
  const navigate = useNavigate();
  const rules = useRules();
  const table = useTableState({ by: 'lastMessageAt', dir: 'DESC' });
  const { params, update } = table;

  const filter = useMemo(() => toTicketFilter(params), [params]);
  const { data, error, isFetching, refetch } = useTickets(filter, table.pageInput);
  const columns = useMemo(() => ticketColumns(display), [display]);
  const applyFilters = useCallback((v: TicketFiltersValues) => update(ticketFiltersToParams(v)), [update]);

  if (!rules.data) return <PageLoader />;
  const total = data?.adminTickets.total ?? 0;

  return (
    <>
      <PageHeader title="Support" subtitle={`Requests from app users · ${total} matching`} />
      <TicketFiltersForm rules={rules.data.validationRules} params={params} onApply={applyFilters} />
      <DataTable
        label="Support requests"
        columns={columns}
        rows={data?.adminTickets.items ?? []}
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
        onRowClick={(t) => navigate(`/support/${t.id}`)}
        emptyText="No support requests match these filters"
      />
    </>
  );
}
