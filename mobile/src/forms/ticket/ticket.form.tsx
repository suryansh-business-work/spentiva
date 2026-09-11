import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { ChipsField, TextField } from '@/components/form';
import { Btn, Card, ErrorText } from '@/components/ui';
import { useCreateTicket } from '@/hooks/mutations';
import { TICKET_CATEGORY_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import type { SupportTicket, ValidationRules } from '@/lib/types';
import { ticketDefaults, ticketSchema, type TicketValues } from './ticket.types';

interface TicketFormProps {
  rules: ValidationRules;
  onCreated: (ticket: SupportTicket) => void;
}

/** New help request: what it's about, a subject and the details */
export function TicketForm({ rules, onCreated }: Readonly<TicketFormProps>) {
  const create = useCreateTicket();
  const schema = useMemo(() => ticketSchema(rules), [rules]);
  const { control, handleSubmit } = useForm<TicketValues>({ resolver: zodResolver(schema), defaultValues: ticketDefaults, mode: 'onTouched' });

  const submit = runAsync(
    'support',
    handleSubmit(async (v) => {
      const { createSupportTicket } = await create.mutateAsync({ input: v });
      onCreated(createSupportTicket);
    }),
  );

  return (
    <YStack gap={14}>
      <Card>
        <ChipsField control={control} name="category" label="What is it about?" items={TICKET_CATEGORY_OPTIONS} />
        <TextField
          control={control}
          name="subject"
          label="Subject"
          placeholder="e.g. App closes when I open reports"
          maxLength={rules.ticketSubjectMax}
        />
        <TextField
          control={control}
          name="message"
          label="Details"
          placeholder="What happened, what you expected, and the steps to get there"
          multiline
          height={140}
          paddingTop={14}
          textAlignVertical="top"
          maxLength={rules.ticketMessageMax}
          hint="Your app version and device are attached automatically"
        />
      </Card>
      <ErrorText error={create.error} />
      <Btn title="Send to support" onPress={submit} loading={create.isPending} />
    </YStack>
  );
}
