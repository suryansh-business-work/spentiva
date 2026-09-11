import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FiChevronDown, FiUsers } from 'react-icons/fi';
import { Text, XStack } from 'tamagui';
import { isShared, trackerCaption, useTrackers } from '@/lib/tracker';
import { C } from '@/theme/colors';
import { Icon } from './Icon';
import { TRACKER_ICONS } from './icons';
import { SelectSheet } from './SelectSheet';
import { Btn, IconBadge } from './ui';

/** Pill with the active tracker (Home, Business …); tap to switch or manage trackers */
export function TrackerSwitcher({ bg = C.pill }: Readonly<{ bg?: string }>) {
  const { trackers, tracker, select, retry } = useTrackers();
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () =>
      trackers.map((t) => ({
        value: t.id,
        label: t.name,
        subtitle: trackerCaption(t),
        left: <IconBadge icon={TRACKER_ICONS[t.kind]} size={36} />,
      })),
    [trackers],
  );
  if (!tracker) return null;

  const manage = () => {
    setOpen(false);
    router.push('/settings/trackers');
  };

  return (
    <>
      <XStack
        alignSelf="flex-start"
        alignItems="center"
        gap={6}
        height={36}
        maxWidth={220}
        paddingHorizontal={12}
        borderRadius={18}
        backgroundColor={bg}
        pressStyle={{ opacity: 0.7 }}
        onPress={() => {
          setOpen(true);
          retry();
        }}
        role="button"
        aria-label={`Tracker: ${tracker.name}. Tap to switch`}
      >
        <Icon as={TRACKER_ICONS[tracker.kind]} size={15} color={C.ink} />
        <Text fontSize={14} fontWeight="700" color={C.ink} numberOfLines={1} flexShrink={1}>
          {tracker.name}
        </Text>
        {isShared(tracker) ? <Icon as={FiUsers} size={13} color={C.sub} /> : null}
        <Icon as={FiChevronDown} size={15} color={C.ink} />
      </XStack>
      <SelectSheet
        open={open}
        onOpenChange={setOpen}
        title="Switch tracker"
        items={items}
        value={tracker.id}
        onSelect={select}
        footer={<Btn title="Manage & share trackers" variant="ghost" height={46} onPress={manage} />}
      />
    </>
  );
}
