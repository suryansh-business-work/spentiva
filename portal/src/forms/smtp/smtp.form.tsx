import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/components/form';
import { useNotify } from '@/components/Notify';
import { ErrorAlert } from '@/components/states';
import type { EnvFieldsFragment } from '@/gql/graphql';
import { useSaveEnvVars, useTestEmail } from '@/hooks/mutations';
import { smtpDefaults, smtpSchema, toSmtpEnv, type SmtpValues } from './smtp.types';

/** SMTP server that sends the daily / monthly / quarterly / yearly report emails */
export function SmtpForm({ vars }: Readonly<{ vars: Map<string, EnvFieldsFragment> }>) {
  const notify = useNotify();
  const save = useSaveEnvVars();
  const test = useTestEmail();
  const password = vars.get('SMTP_PASSWORD');
  const hasPassword = Boolean(password?.isSet);
  const ready = Boolean(vars.get('SMTP_HOST')?.isSet && vars.get('SMTP_FROM')?.isSet);
  const schema = useMemo(() => smtpSchema(hasPassword), [hasPassword]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SmtpValues>({ resolver: zodResolver(schema), values: smtpDefaults(vars), mode: 'onChange' });

  const submit = handleSubmit(async (v) => {
    await save.mutateAsync({ input: toSmtpEnv(v) });
    reset({ ...v, password: '' });
    notify.success('Email settings saved');
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <FormTextField control={control} name="host" label="SMTP server" placeholder="smtp.gmail.com" autoComplete="off" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormTextField control={control} name="port" label="Port" hint="465 = TLS, 587 = STARTTLS" fullWidth />
        </Grid>
      </Grid>
      <FormTextField control={control} name="user" label="Username" autoComplete="off" hint="Leave empty if the server needs no login" />
      <FormTextField
        control={control}
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder={hasPassword ? `Saved (${password?.value ?? ''}) — type a new one to replace it` : ''}
        hint="For Gmail use an app password. Stored encrypted."
      />
      <FormTextField control={control} name="from" label="From" placeholder="Spentiva <reports@example.com>" hint="Who the reports come from" />
      <ErrorAlert error={save.error} />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          Save email settings
        </Button>
        <Button variant="outlined" onClick={() => test.mutate({})} loading={test.isPending} disabled={!ready}>
          Send test email
        </Button>
      </Stack>
      {test.data ? <Alert severity="success">Test email sent to {test.data.testEmail}</Alert> : <ErrorAlert error={test.error} />}
    </Stack>
  );
}
