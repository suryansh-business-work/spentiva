import { router, useLocalSearchParams } from 'expo-router';
import { FiCheck } from 'react-icons/fi';
import { Btn, Card, EmptyState, H3, Header, Muted, Screen, Success } from '@/components/ui';
import { ShareTrackerForm } from '@/forms/share-tracker';
import { TrackerForm } from '@/forms/tracker';
import { useUser } from '@/lib/auth';
import { trackerCaption, useTrackers } from '@/lib/tracker';
import type { Tracker } from '@/lib/types';
import { MembersCard } from './MembersCard';
import { TrackerActions } from './TrackerActions';

function UseTracker({ tracker, active, onUse }: Readonly<{ tracker: Tracker; active: boolean; onUse: () => void }>) {
  if (active) return <Success>The app is showing this tracker.</Success>;
  return <Btn title={`Switch to ${tracker.name}`} variant="lime" icon={FiCheck} onPress={onUse} />;
}

/** One tracker: switch to it, its settings (owner), who it's shared with, share, delete / leave */
export default function TrackerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUser();
  const { trackers, tracker: active, select } = useTrackers();
  const tracker = trackers.find((t) => t.id === id);

  if (!tracker) {
    return (
      <Screen>
        <Header title="Tracker" back />
        <EmptyState title="Tracker not found" message="It may have been deleted, or it is no longer shared with you." />
      </Screen>
    );
  }

  const owner = tracker.role === 'OWNER';
  const use = () => {
    select(tracker.id);
    router.back();
  };

  return (
    <Screen>
      <Header title={tracker.name} subtitle={trackerCaption(tracker)} back />
      <UseTracker tracker={tracker} active={active?.id === tracker.id} onUse={use} />
      {owner ? (
        <Card>
          <H3>Settings</H3>
          <TrackerForm tracker={tracker} defaultCurrency={tracker.currency} />
        </Card>
      ) : null}
      <MembersCard tracker={tracker} userId={user.id} />
      {owner ? (
        <Card>
          <H3>Share</H3>
          <Muted>“Can edit” lets them add and change entries, categories and payment modes. “View only” lets them see everything.</Muted>
          <ShareTrackerForm trackerId={tracker.id} />
        </Card>
      ) : null}
      <TrackerActions tracker={tracker} />
    </Screen>
  );
}
