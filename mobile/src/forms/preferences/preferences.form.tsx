import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { CurrencyField, TextField, TimezoneField } from '@/components/form';
import { Btn, Card, ErrorText } from '@/components/ui';
import { useUpdateProfile } from '@/hooks/mutations';
import { useAuth } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import type { User } from '@/lib/types';
import { preferencesDefaults, preferencesSchema, toProfileInput, type PreferencesValues } from './preferences.types';

export function PreferencesForm({ user, onDone }: Readonly<{ user: User; onDone: () => void }>) {
  const { setUser } = useAuth();
  const update = useUpdateProfile(setUser);
  const { control, handleSubmit } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferencesDefaults(user),
  });

  const submit = runAsync(
    'preferences',
    handleSubmit(async (values) => {
      await update.mutateAsync(toProfileInput(values));
      onDone();
    }),
  );

  return (
    <YStack gap={14}>
      <Card>
        <TextField control={control} name="name" label="Name" autoCapitalize="words" />
        <CurrencyField
          control={control}
          name="currency"
          label="Default currency (ISO 4217)"
          hint="New trackers start with it. Each tracker's currency and budget are in its settings."
        />
        <TimezoneField control={control} name="timezone" label="Time zone (IANA)" hint="Days and months in reports follow this zone" />
        <TextField
          control={control}
          name="locale"
          label="Format locale (BCP 47)"
          placeholder="en-IN"
          autoCapitalize="none"
          hint="Controls number & date formats, e.g. en-IN → 1,00,000 · en-US → 100,000"
        />
      </Card>
      <ErrorText error={update.error} />
      <Btn title="Save" onPress={submit} loading={update.isPending} />
    </YStack>
  );
}
