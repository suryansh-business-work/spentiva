import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/components/form';
import { ErrorAlert } from '@/components/states';
import { useAuth } from '@/lib/auth';
import { loginDefaults, loginSchema, type LoginValues } from './login.types';

/** Admin sign-in (email + password of a Spentiva admin account) */
export function LoginForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: loginDefaults, mode: 'onTouched' });

  const submit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err);
    }
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit}>
      <FormTextField control={control} name="email" label="Email" type="email" autoComplete="email" autoFocus />
      <FormTextField control={control} name="password" label="Password" type="password" autoComplete="current-password" />
      <ErrorAlert error={error} />
      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        Sign in
      </Button>
    </Stack>
  );
}
