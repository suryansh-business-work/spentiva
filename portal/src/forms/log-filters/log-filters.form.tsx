import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useMemo } from 'react';
import { FormDateField, FormSelect, FormTextField } from '@/components/form';
import type { RulesFieldsFragment } from '@/gql/graphql';
import { useFilterForm } from '../useFilterForm';
import { LEVEL_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS, logFiltersFromParams, logFiltersSchema, type LogFiltersValues } from './log-filters.types';

interface LogFiltersFormProps {
  rules: RulesFieldsFragment;
  params: URLSearchParams;
  onApply: (values: LogFiltersValues) => void;
}

/** Search, level, source, status and date range for the Logs table (applies as you type) */
export function LogFiltersForm({ rules, params, onApply }: Readonly<LogFiltersFormProps>) {
  const schema = useMemo(() => logFiltersSchema(rules), [rules]);
  const values = useMemo(() => logFiltersFromParams(params), [params]);
  const { control } = useFilterForm(schema, values, onApply);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }} component="form" role="search" aria-label="Filter logs" onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormTextField
            control={control}
            name="search"
            label="Search"
            placeholder="Message, screen, email or device"
            hint="What happened, where, or who"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormSelect control={control} name="levels" label="Level" options={LEVEL_OPTIONS} multiple emptyLabel="All levels" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
          <FormSelect control={control} name="source" label="Source" options={SOURCE_OPTIONS} emptyLabel="All" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
          <FormSelect control={control} name="status" label="Status" options={STATUS_OPTIONS} emptyLabel="All" />
        </Grid>
        <Grid size={{ xs: 6, md: 1.5 }}>
          <FormDateField control={control} name="from" label="From" disableFuture />
        </Grid>
        <Grid size={{ xs: 6, md: 1.5 }}>
          <FormDateField control={control} name="to" label="To" disableFuture />
        </Grid>
      </Grid>
    </Paper>
  );
}
