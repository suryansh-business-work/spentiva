import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, Card, ErrorText } from '@/components/ui';
import { useChangePassword } from '@/hooks/mutations';
import { runAsync } from '@/lib/log';
import { passwordDefaults, passwordSchema, type PasswordValues } from './password.types';

export function PasswordForm({ onDone }: Readonly<{ onDone: () => void }>) {
  const change = useChangePassword();
  const { control, handleSubmit } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: passwordDefaults });

  const submit = runAsync(
    'password',
    handleSubmit(async (v) => {
      await change.mutateAsync({ current: v.current, next: v.next });
      onDone();
    }),
  );

  return (
    <YStack gap={14}>
      <Card>
        <TextField control={control} name="current" label="Current password" secureTextEntry autoComplete="current-password" />
        <TextField control={control} name="next" label="New password" secureTextEntry autoComplete="new-password" hint="At least 6 characters" />
        <TextField control={control} name="confirm" label="Confirm new password" secureTextEntry />
      </Card>
      <ErrorText error={change.error} />
      <Btn title="Update password" onPress={submit} loading={change.isPending} />
    </YStack>
  );
}
