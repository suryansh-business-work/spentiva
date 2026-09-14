import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useMemo } from 'react';
import { FormSelect, FormTextField } from '@/components/form';
import type { RulesFieldsFragment } from '@/gql/graphql';
import { useFilterForm } from '../useFilterForm';
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  ticketFiltersFromParams,
  ticketFiltersSchema,
  type TicketFiltersValues,
} from './ticket-filters.types';

interface TicketFiltersFormProps {
  rules: RulesFieldsFragment;
  params: URLSearchParams;
  onApply: (values: TicketFiltersValues) => void;
}

/** Search, status, priority and category for the Support table (applies as you type) */
export function TicketFiltersForm({ rules, params, onApply }: Readonly<TicketFiltersFormProps>) {
  const schema = useMemo(() => ticketFiltersSchema(rules), [rules]);
  const values = useMemo(() => ticketFiltersFromParams(params), [params]);
  const { control } = useFilterForm(schema, values, onApply);

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, mb: 2 }}
      component="form"
      role="search"
      aria-label="Filter support requests"
      onSubmit={(e) => e.preventDefault()}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField control={control} name="search" label="Search" placeholder="Subject" />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormSelect control={control} name="status" label="Status" options={STATUS_OPTIONS} emptyLabel="All" />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormSelect control={control} name="priority" label="Priority" options={PRIORITY_OPTIONS} emptyLabel="All" />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormSelect control={control} name="category" label="Category" options={CATEGORY_OPTIONS} emptyLabel="All" />
        </Grid>
      </Grid>
    </Paper>
  );
}
