import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useMemo } from 'react';
import { FormSelect, FormTextField } from '@/components/form';
import type { RulesFieldsFragment } from '@/gql/graphql';
import { useFilterForm } from '../useFilterForm';
import { ROLE_OPTIONS, STATE_OPTIONS, userFiltersFromParams, userFiltersSchema, type UserFiltersValues } from './user-filters.types';

interface UserFiltersFormProps {
  rules: RulesFieldsFragment;
  params: URLSearchParams;
  onApply: (values: UserFiltersValues) => void;
}

/** Search + role + account status for the Users table (applies as you type) */
export function UserFiltersForm({ rules, params, onApply }: Readonly<UserFiltersFormProps>) {
  const schema = useMemo(() => userFiltersSchema(rules), [rules]);
  const values = useMemo(() => userFiltersFromParams(params), [params]);
  const { control } = useFilterForm(schema, values, onApply);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }} component="form" role="search" aria-label="Filter users" onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField control={control} name="search" label="Search" placeholder="Name or email" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormSelect control={control} name="role" label="Role" options={ROLE_OPTIONS} emptyLabel="All" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormSelect control={control} name="state" label="Account" options={STATE_OPTIONS} emptyLabel="All" />
        </Grid>
      </Grid>
    </Paper>
  );
}
