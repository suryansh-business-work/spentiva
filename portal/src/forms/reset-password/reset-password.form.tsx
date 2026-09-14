import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/components/form';
import { ErrorAlert } from '@/components/states';
import type { RulesFieldsFragment } from '@/gql/graphql';
import { resetPasswordDefaults, resetPasswordSchema, type ResetPasswordValues } from './reset-password.types';

interface ResetPasswordFormProps {
  rules: RulesFieldsFragment;
  onSubmit: (password: string) => Promise<unknown>;
  onCancel: () => void;
  error: unknown;
}

/** New password for a user (admin) */
export function ResetPasswordForm({ rules, onSubmit, onCancel, error }: Readonly<ResetPasswordFormProps>) {
  const schema = useMemo(() => resetPasswordSchema(rules), [rules]);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(schema), defaultValues: resetPasswordDefaults, mode: 'onChange' });

  return (
    <Stack component="form" noValidate spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit((v) => onSubmit(v.password))}>
      <FormTextField
        control={control}
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        hint={`${rules.passwordMin}–${rules.passwordMax} characters. Share it with the user privately.`}
        autoFocus
      />
      <FormTextField control={control} name="confirm" label="Confirm password" type="password" autoComplete="new-password" />
      <ErrorAlert error={error} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          Set password
        </Button>
      </Stack>
    </Stack>
  );
}
