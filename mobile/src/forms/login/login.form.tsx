import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, ErrorText } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import { loginDefaults, loginSchema, toLoginInput, type LoginValues } from './login.types';

export function LoginForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: loginDefaults });

  const submit = runAsync(
    'login',
    handleSubmit(async (values) => {
      setError(null);
      const input = toLoginInput(values);
      try {
        await signIn(input.email, input.password);
      } catch (err) {
        setError(err);
      }
    }),
  );

  return (
    <YStack gap={16}>
      <TextField
        control={control}
        name="email"
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextField
        control={control}
        name="password"
        label="Password"
        placeholder="Your password"
        secureTextEntry
        autoComplete="password"
        onSubmitEditing={submit}
      />
      <ErrorText error={error} />
      <Btn title="Log in" onPress={submit} loading={isSubmitting} />
    </YStack>
  );
}
