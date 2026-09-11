import { z } from 'zod';
import type { TrackerInput } from '@/gql/graphql';
import { TRACKER_KIND_OPTIONS } from '@/lib/constants';
import type { Tracker, TrackerKind } from '@/lib/types';
import { toOptionalAmount, zCurrencyCode, zName, zOptionalAmount } from '../validators';

const KINDS = TRACKER_KIND_OPTIONS.map((o) => o.value) as [TrackerKind, ...TrackerKind[]];

export const trackerSchema = z.object({
  name: zName,
  kind: z.enum(KINDS, 'Pick what this tracker is for'),
  currency: zCurrencyCode,
  monthlyBudget: zOptionalAmount,
});

export type TrackerValues = z.infer<typeof trackerSchema>;

/** A new tracker starts as "Home & personal" in the given currency */
export const trackerDefaults = (tracker: Tracker | null, currency: string): TrackerValues => ({
  name: tracker?.name ?? '',
  kind: tracker?.kind ?? 'PERSONAL',
  currency: tracker?.currency ?? currency,
  monthlyBudget: tracker?.monthlyBudget ? String(tracker.monthlyBudget) : '',
});

export const toTrackerInput = (v: TrackerValues): TrackerInput => ({
  name: v.name.trim(),
  kind: v.kind,
  currency: v.currency,
  monthlyBudget: toOptionalAmount(v.monthlyBudget),
});
