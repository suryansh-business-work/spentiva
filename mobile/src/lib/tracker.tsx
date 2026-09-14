import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TrackersQuery } from '@/graphql/trackers';
import { keys } from '@/hooks/keys';
import { gql } from './api';
import { useAuth } from './auth';
import { TRACKER_KIND_OPTIONS, TRACKER_ROLE_LABELS } from './constants';
import { logError } from './log';
import type { Tracker, TrackerRole } from './types';

type Status = 'loading' | 'error' | 'ready';

interface TrackerContextValue {
  status: Status;
  error: unknown;
  /** Reloads the list (e.g. to pick up a tracker someone just shared) */
  retry: () => void;
  refreshing: boolean;
  /** Owned trackers first, then the ones shared with the user */
  trackers: Tracker[];
  /** The tracker every screen shows (the one picked last, else the user's default) */
  tracker: Tracker | null;
  select: (id: string) => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

/** The pick is remembered per account on this device */
const storageKey = (userId: string) => `spentiva.tracker.${userId}`;

function useStoredPick(userId: string | null) {
  const [pick, setPick] = useState<{ userId: string; id: string | null } | null>(null);

  useEffect(() => {
    if (!userId) return;
    SecureStore.getItemAsync(storageKey(userId))
      .then((id) => setPick({ userId, id }))
      .catch((err: unknown) => {
        logError('tracker')(err);
        setPick({ userId, id: null });
      });
  }, [userId]);

  const save = useCallback(
    (id: string) => {
      if (!userId) return;
      setPick({ userId, id });
      SecureStore.setItemAsync(storageKey(userId), id).catch(logError('tracker'));
    },
    [userId],
  );

  const loaded = pick !== null && pick.userId === userId;
  return { id: loaded ? pick.id : null, loaded, save };
}

function statusOf(loaded: boolean, hasData: boolean, failed: boolean): Status {
  if (hasData && loaded) return 'ready';
  return failed ? 'error' : 'loading';
}

/** Which tracker the app shows. Sits above TamaguiProvider so sheets can read it too. */
export function TrackerProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { status: auth, user } = useAuth();
  const userId = auth === 'signedIn' && user ? user.id : null;
  const query = useQuery({ queryKey: keys.trackers, queryFn: () => gql(TrackersQuery).then((d) => d.trackers), enabled: userId !== null });
  const pick = useStoredPick(userId);
  const { refetch } = query;

  const value = useMemo<TrackerContextValue>(() => {
    const trackers = query.data ?? [];
    const tracker = trackers.find((t) => t.id === pick.id) ?? trackers.find((t) => t.isDefault) ?? trackers[0] ?? null;
    return {
      status: statusOf(pick.loaded, Boolean(query.data), query.isError),
      error: query.error,
      retry: () => {
        refetch().catch(logError('tracker'));
      },
      refreshing: query.isRefetching,
      trackers,
      tracker,
      select: pick.save,
    };
  }, [query.data, query.isError, query.error, query.isRefetching, refetch, pick.id, pick.loaded, pick.save]);

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTrackers(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTrackers must be used inside TrackerProvider');
  return ctx;
}

/** The active tracker (signed-in screens only render once it is known) */
export function useTracker(): Tracker {
  const { tracker } = useTrackers();
  if (!tracker) throw new Error('No tracker selected');
  return tracker;
}

export const canEdit = (role: TrackerRole) => role !== 'VIEWER';
export const isShared = (tracker: Tracker) => tracker.members.length > 1;

const KIND_LABELS = new Map(TRACKER_KIND_OPTIONS.map((o) => [o.value, o.label]));

/** e.g. "Business · INR · shared with 2" or "Home & personal · INR · Rahul's · View only" */
export function trackerCaption(tracker: Tracker): string {
  const parts = [KIND_LABELS.get(tracker.kind) ?? tracker.kind, tracker.currency];
  if (tracker.role === 'OWNER') {
    if (isShared(tracker)) parts.push(`shared with ${tracker.members.length - 1}`);
  } else {
    parts.push(`${tracker.owner.name}'s`, TRACKER_ROLE_LABELS[tracker.role]);
  }
  return parts.join(' · ');
}
