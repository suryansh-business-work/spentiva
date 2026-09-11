import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { CurrencyField, TextField } from '@/components/form';
import { Btn, ErrorText, Tiny } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { deviceDefaults } from '@/lib/device';
import { runAsync } from '@/lib/log';
import { signupDefaults, signupSchema, toSignupInput, type SignupValues } from './signup.types';

export function SignupForm() {
  const { signUp } = useAuth();
  const device = useMemo(() => deviceDefaults(), []);
  const [error, setError] = useState<unknown>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema), defaultValues: signupDefaults(device.currency) });

  const submit = runAsync(
    'signup',
    handleSubmit(async (values) => {
      setError(null);
      try {
        await signUp(toSignupInput(values, device));
      } catch (err) {
        setError(err);
      }
    }),
  );

  return (
    <YStack gap={16}>
      <TextField control={control} name="name" label="Name" placeholder="Your name" autoCapitalize="words" autoComplete="name" />
      <TextField
        control={control}
        name="email"
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextField control={control} name="password" label="Password" placeholder="At least 6 characters" secureTextEntry autoComplete="new-password" />
      <TextField control={control} name="confirm" label="Confirm password" placeholder="Repeat password" secureTextEntry />
      <CurrencyField control={control} name="currency" label="Main currency" hint="Totals and reports use this currency" />
      <Tiny>Time zone: {device.timezone} · change it later in Profile → Preferences.</Tiny>
      <ErrorText error={error} />
      <Btn title="Create account" onPress={submit} loading={isSubmitting} />
    </YStack>
  );
}
