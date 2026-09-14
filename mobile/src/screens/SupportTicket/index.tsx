import { useLocalSearchParams } from 'expo-router';
import { Card, EmptyState, ErrorState, Header, Loading, Muted, Screen } from '@/components/ui';
import { TicketReplyForm } from '@/forms/ticket-reply';
import { useTicket, useValidationRules } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { TICKET_STATUS_LABELS } from '@/lib/constants';
import { Message } from './Message';

const CLOSED_STATES = new Set(['RESOLVED', 'CLOSED']);

/** One help request: the conversation with support and a reply box */
export default function SupportTicketScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const user = useUser();
  const rules = useValidationRules();
  const { data: ticket, error, isLoading, refetch, isRefetching } = useTicket(id);

  const refresh = () => {
    refetch().catch((err: unknown) => console.warn('[support]', err));
  };

  if (isLoading || rules.isLoading) return <Loading />;
  if (!ticket) {
    return (
      <Screen>
        <Header title="Support request" back />
        {error ? <ErrorState error={error} onRetry={refresh} /> : <EmptyState title="Request not found" />}
      </Screen>
    );
  }

  return (
    <Screen onRefresh={refresh} refreshing={isRefetching}>
      <Header title={ticket.subject} subtitle={TICKET_STATUS_LABELS[ticket.status]} back />
      {ticket.messages.map((m) => (
        <Message key={m.id} message={m} display={user} />
      ))}
      {ticket.lastAuthor === 'USER' ? <Muted textAlign="center">Support usually replies within a day. Pull down to refresh.</Muted> : null}
      <Card>
        {rules.data ? (
          <TicketReplyForm ticketId={ticket.id} rules={rules.data} reopens={CLOSED_STATES.has(ticket.status)} />
        ) : (
          <ErrorState error={rules.error} />
        )}
      </Card>
    </Screen>
  );
}
