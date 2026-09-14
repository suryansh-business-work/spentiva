import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, ErrorText } from '@/components/ui';
import { useReplyTicket } from '@/hooks/mutations';
import { runAsync } from '@/lib/log';
import type { ValidationRules } from '@/lib/types';
import { ticketReplyDefaults, ticketReplySchema, type TicketReplyValues } from './ticket-reply.types';

interface TicketReplyFormProps {
  ticketId: string;
  rules: ValidationRules;
  /** A resolved / closed request is reopened by a reply */
  reopens: boolean;
}

/** Message support on an existing request */
export function TicketReplyForm({ ticketId, rules, reopens }: Readonly<TicketReplyFormProps>) {
  const reply = useReplyTicket();
  const schema = useMemo(() => ticketReplySchema(rules), [rules]);
  const { control, handleSubmit, reset } = useForm<TicketReplyValues>({ resolver: zodResolver(schema), defaultValues: ticketReplyDefaults });

  const submit = runAsync(
    'support',
    handleSubmit(async (v) => {
      await reply.mutateAsync({ id: ticketId, body: v.body });
      reset(ticketReplyDefaults);
    }),
  );

  return (
    <YStack gap={10}>
      <TextField
        control={control}
        name="body"
        placeholder="Write a message…"
        multiline
        height={100}
        paddingTop={14}
        textAlignVertical="top"
        maxLength={rules.ticketMessageMax}
        hint={reopens ? 'Sending a message reopens this request' : undefined}
      />
      <ErrorText error={reply.error} />
      <Btn title="Send" onPress={submit} loading={reply.isPending} height={48} />
    </YStack>
  );
}
