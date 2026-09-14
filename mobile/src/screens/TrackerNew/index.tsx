import { router } from 'expo-router';
import { Card, Header, Screen } from '@/components/ui';
import { TrackerForm } from '@/forms/tracker';
import { useUser } from '@/lib/auth';
import { useTrackers } from '@/lib/tracker';
import type { Tracker } from '@/lib/types';

/** Create a tracker; the app switches to it right away */
export default function TrackerNewScreen() {
  const user = useUser();
  const { select } = useTrackers();
  const created = (tracker: Tracker) => {
    select(tracker.id);
    router.back();
  };
  return (
    <Screen>
      <Header title="New tracker" back />
      <Card>
        <TrackerForm tracker={null} defaultCurrency={user.currency} onSaved={created} />
      </Card>
    </Screen>
  );
}
