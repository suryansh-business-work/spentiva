import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { Btn, Divider, ErrorText, Success, Toggle } from '@/components/ui';
import { useSetEmailReports } from '@/hooks/mutations';
import { REPORT_FREQUENCY_OPTIONS } from '@/lib/constants';
import { formatDate, type DisplaySettings } from '@/lib/format';
import { runAsync } from '@/lib/log';
import type { EmailReportSchedule } from '@/lib/types';
import { emailReportsDefaults, emailReportsSchema, toFrequencies, type EmailReportsValues } from './email-reports.types';

interface EmailReportsFormProps {
  schedules: EmailReportSchedule[];
  settings: DisplaySettings;
}

/** Which reports of the active tracker arrive by email */
export function EmailReportsForm({ schedules, settings }: Readonly<EmailReportsFormProps>) {
  const save = useSetEmailReports();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EmailReportsValues>({ resolver: zodResolver(emailReportsSchema), values: emailReportsDefaults(schedules) });
  const next = new Map(schedules.map((s) => [s.frequency, s.nextRunAt]));

  const submit = runAsync(
    'email-reports',
    handleSubmit(async (v) => {
      await save.mutateAsync(toFrequencies(v));
    }),
  );

  return (
    <YStack gap={4}>
      {REPORT_FREQUENCY_OPTIONS.map((option, i) => {
        const when = next.get(option.value);
        const hint = when ? `${option.hint} · next ${formatDate(when, settings, 'dateTime')}` : option.hint;
        return (
          <YStack key={option.value}>
            {i > 0 ? <Divider /> : null}
            <Controller
              control={control}
              name={option.value}
              render={({ field }) => <Toggle label={option.label} hint={hint} value={field.value} onChange={field.onChange} />}
            />
          </YStack>
        );
      })}
      <ErrorText error={save.error} />
      {save.isSuccess && !isDirty ? <Success>Saved</Success> : null}
      <YStack marginTop={10}>
        <Btn title="Save" onPress={submit} loading={save.isPending} disabled={!isDirty} height={48} />
      </YStack>
    </YStack>
  );
}
