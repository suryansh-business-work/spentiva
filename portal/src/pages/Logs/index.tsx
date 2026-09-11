import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { PageLoader } from '@/components/states';
import { LogFiltersForm, logFiltersToParams, toLogFilter, type LogFiltersValues } from '@/forms/log-filters';
import { useLogs, useRules } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { useTableState } from '@/hooks/useTableState';
import { BulkActions } from './BulkActions';
import { logColumns } from './columns';
import { LinkFilters } from './LinkFilters';
import { LogDrawer } from './LogDrawer';

/** Every crash / error from the app, the portal and the API — who, when, why and where */
export default function LogsPage() {
  const display = useDisplay();
  const rules = useRules();
  const table = useTableState({ by: 'occurredAt', dir: 'DESC' });
  const { params, update } = table;
  const [selected, setSelected] = useState<string[]>([]);

  const filter = useMemo(() => toLogFilter(params, display.timezone), [params, display.timezone]);
  const { data, error, isFetching, refetch } = useLogs(filter, table.pageInput);
  const columns = useMemo(() => logColumns(display), [display]);

  const applyFilters = useCallback((v: LogFiltersValues) => update(logFiltersToParams(v)), [update]);
  const openLog = (id: string | null) => update({ log: id }, true);

  if (!rules.data) return <PageLoader />;
  const total = data?.adminLogs.total ?? 0;

  return (
    <>
      <PageHeader title="Logs" subtitle={`Crashes and errors from the app, portal and API · ${total} matching`} />
      <LogFiltersForm rules={rules.data.validationRules} params={params} onApply={applyFilters} />
      <LinkFilters params={params} onClear={(key) => update({ [key]: null })} />
      <BulkActions selected={selected} onDone={() => setSelected([])} />
      <DataTable
        label="Logs"
        columns={columns}
        rows={data?.adminLogs.items ?? []}
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
        onRowClick={(row) => openLog(row.id)}
        selection={{ selected, onChange: setSelected }}
        emptyText="No logs match these filters"
      />
      <LogDrawer id={params.get('log')} onClose={() => openLog(null)} onShowSimilar={(fp) => update({ fingerprint: fp, log: null })} />
    </>
  );
}
