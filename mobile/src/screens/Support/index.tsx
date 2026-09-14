import { router } from 'expo-router';
import { Fragment } from 'react';
import { FiLifeBuoy, FiMessageCircle, FiPlus } from 'react-icons/fi';
import { Btn, Card, Divider, EmptyState, ErrorState, Header, ListRow, Loading, Muted, Screen } from '@/components/ui';
import { useMyTickets } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { TICKET_STATUS_LABELS } from '@/lib/constants';
import { dayLabel } from '@/lib/format';
import type { SupportTicket } from '@/lib/types';
import { C } from '@/theme/colors';

const subtitleOf = (t: SupportTicket, when: string) => {
  const waiting = t.lastAuthor === 'ADMIN' && t.status !== 'CLOSED' ? ' · New reply' : '';
  return `${TICKET_STATUS_LABELS[t.status]} · ${when}${waiting}`;
};

/** Help & support: the user's requests and the way to raise a new one */
export default function SupportScreen() {
  const user = useUser();
  const { data, error, isLoading, refetch, isRefetching } = useMyTickets();
  const open = () => router.push('/settings/support/new');

  const refresh = () => {
    refetch().catch((err: unknown) => console.warn('[support]', err));
  };

  return (
    <Screen onRefresh={refresh} refreshing={isRefetching}>
      <Header title="Help & support" back />
      <Card>
        <Muted>Something not working, or a question? Send it to the Spentiva team — replies show up here.</Muted>
        <Btn title="New request" icon={FiPlus} onPress={open} height={48} />
      </Card>
      {isLoading ? <Loading /> : null}
      {error ? <ErrorState error={error} onRetry={refresh} /> : null}
      {data && data.length === 0 ? (
        <EmptyState icon={FiLifeBuoy} title="No requests yet" message="Your conversations with support will appear here." />
      ) : null}
      {data && data.length > 0 ? (
        <Card gap={0} paddingVertical={6}>
          {data.map((t, i) => (
            <Fragment key={t.id}>
              {i === 0 ? null : <Divider />}
              <ListRow
                icon={FiMessageCircle}
                iconColor={t.lastAuthor === 'ADMIN' ? C.green : C.sub}
                title={t.subject}
                subtitle={subtitleOf(t, dayLabel(t.lastMessageAt, user))}
                onPress={() => router.push(`/settings/support/${t.id}`)}
              />
            </Fragment>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
