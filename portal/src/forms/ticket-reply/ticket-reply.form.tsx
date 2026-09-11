import { zodResolver } from '@hookform/resolvers/zod';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormSelect, FormTextField } from '@/components/form';
import { ErrorAlert } from '@/components/states';
import type { RulesFieldsFragment, TicketStatus } from '@/gql/graphql';
import { STATUS_OPTIONS, autoStatusHint, ticketReplyDefaults, ticketReplySchema, type TicketReplyValues } from './ticket-reply.types';

interface TicketReplyFormProps {
  rules: RulesFieldsFragment;
  currentStatus: TicketStatus;
  onSubmit: (body: string, status: TicketStatus | null) => Promise<unknown>;
  error: unknown;
}

/** Admin reply to a support request (the user sees it in the app under Help & support) */
export function TicketReplyForm({ rules, currentStatus, onSubmit, error }: Readonly<TicketReplyFormProps>) {
  const schema = useMemo(() => ticketReplySchema(rules), [rules]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TicketReplyValues>({ resolver: zodResolver(schema), defaultValues: ticketReplyDefaults, mode: 'onTouched' });

  const submit = handleSubmit(async (v) => {
    await onSubmit(v.body.trim(), v.status || null);
    reset(ticketReplyDefaults);
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit} aria-label="Reply">
      <FormTextField control={control} name="body" label="Reply" multiline minRows={3} maxLength={rules.ticketMessageMax} />
      <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelect
            control={control}
            name="status"
            label="Set status"
            options={STATUS_OPTIONS}
            emptyLabel="Automatic"
            hint={autoStatusHint(currentStatus)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" endIcon={<SendIcon />} loading={isSubmitting}>
            Send reply
          </Button>
        </Grid>
      </Grid>
      <ErrorAlert error={error} />
    </Stack>
  );
}
