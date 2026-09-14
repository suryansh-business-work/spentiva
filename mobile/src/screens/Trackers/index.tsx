import { router } from 'expo-router';
import { Fragment } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Text, YStack } from 'tamagui';
import { TRACKER_ICONS } from '@/components/icons';
import { Card, Divider, Header, IconButton, ListRow, Muted, Screen, SectionTitle } from '@/components/ui';
import { trackerCaption, useTrackers } from '@/lib/tracker';
import type { Tracker } from '@/lib/types';
import { C } from '@/theme/colors';

function InUseBadge() {
  return (
    <YStack backgroundColor={C.limeSoft} borderRadius={999} paddingHorizontal={10} paddingVertical={3}>
      <Text fontSize={11} fontWeight="700" color={C.greenDark}>
        In use
      </Text>
    </YStack>
  );
}

function TrackerList({ title, list, activeId }: Readonly<{ title: string; list: Tracker[]; activeId?: string }>) {
  if (list.length === 0) return null;
  return (
    <>
      <SectionTitle title={title} />
      <Card gap={0} paddingVertical={6}>
        {list.map((t, i) => (
          <Fragment key={t.id}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              icon={TRACKER_ICONS[t.kind]}
              title={t.name}
              subtitle={trackerCaption(t)}
              right={t.id === activeId ? <InUseBadge /> : null}
              onPress={() => router.push({ pathname: '/settings/trackers/[id]', params: { id: t.id } })}
            />
          </Fragment>
        ))}
      </Card>
    </>
  );
}

/** Every tracker the user owns or was given access to */
export default function TrackersScreen() {
  const { trackers, tracker, retry, refreshing } = useTrackers();
  const owned = trackers.filter((t) => t.role === 'OWNER');
  const shared = trackers.filter((t) => t.role !== 'OWNER');
  return (
    <Screen refreshing={refreshing} onRefresh={retry}>
      <Header title="Trackers" back right={<IconButton icon={FiPlus} onPress={() => router.push('/settings/trackers/new')} label="New tracker" />} />
      <Muted>
        Keep separate books, like Home and Business. Each has its own categories, payment modes, currency and budget, and you can share it with other
        Spentiva users.
      </Muted>
      <TrackerList title="Your trackers" list={owned} activeId={tracker?.id} />
      <TrackerList title="Shared with you" list={shared} activeId={tracker?.id} />
    </Screen>
  );
}
