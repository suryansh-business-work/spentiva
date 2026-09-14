import { router } from 'expo-router';
import { ErrorState, Header, Loading, Screen } from '@/components/ui';
import { TicketForm } from '@/forms/ticket';
import { useValidationRules } from '@/hooks/queries';

/** Raise a help request (the portal's Support section receives it) */
export default function SupportNewScreen() {
  const rules = useValidationRules();

  const retry = () => {
    rules.refetch().catch((err: unknown) => console.warn('[support]', err));
  };

  return (
    <Screen>
      <Header title="New request" back />
      {rules.isLoading ? <Loading /> : null}
      {rules.error ? <ErrorState error={rules.error} onRetry={retry} /> : null}
      {rules.data ? <TicketForm rules={rules.data} onCreated={(t) => router.replace(`/settings/support/${t.id}`)} /> : null}
    </Screen>
  );
}
