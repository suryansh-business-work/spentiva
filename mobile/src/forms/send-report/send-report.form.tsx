import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import { YStack } from 'tamagui';
import { ChipsField } from '@/components/form';
import { Btn, ErrorText, Success } from '@/components/ui';
import { useSendReportEmail } from '@/hooks/mutations';
import { EMAIL_PERIOD_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import { sendReportDefaults, sendReportSchema, type SendReportValues } from './send-report.types';

/** Email the active tracker's report for a period now */
export function SendReportForm() {
  const send = useSendReportEmail();
  const { control, handleSubmit } = useForm<SendReportValues>({ resolver: zodResolver(sendReportSchema), defaultValues: sendReportDefaults });

  const submit = runAsync(
    'send-report',
    handleSubmit(async (v) => {
      await send.mutateAsync(v.period);
    }),
  );

  return (
    <YStack gap={12}>
      <ChipsField control={control} name="period" label="Period" items={EMAIL_PERIOD_OPTIONS} />
      <ErrorText error={send.error} />
      {send.data ? <Success>Sent to {send.data}. It can take a minute to arrive.</Success> : null}
      <Btn title="Email me this report" icon={FiSend} onPress={submit} loading={send.isPending} height={48} />
    </YStack>
  );
}
