import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { YStack } from 'tamagui';
import { ChipsField, CurrencyField, TextField } from '@/components/form';
import { TRACKER_ICONS } from '@/components/icons';
import { Btn, ErrorText, Muted, Success } from '@/components/ui';
import { useCreateTracker, useUpdateTracker } from '@/hooks/trackerMutations';
import { TRACKER_KIND_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import type { Tracker } from '@/lib/types';
import { toTrackerInput, trackerDefaults, trackerSchema, type TrackerValues } from './tracker.types';

interface TrackerFormProps {
  /** null creates a new tracker */
  tracker: Tracker | null;
  defaultCurrency: string;
  onSaved?: (tracker: Tracker) => void;
}

const KIND_ITEMS = TRACKER_KIND_OPTIONS.map((o) => ({ value: o.value, label: o.label, icon: TRACKER_ICONS[o.value] }));

/** Name, kind, currency and monthly budget of a tracker */
export function TrackerForm({ tracker, defaultCurrency, onSaved }: Readonly<TrackerFormProps>) {
  const create = useCreateTracker();
  const update = useUpdateTracker();
  const { control, handleSubmit } = useForm<TrackerValues>({
    resolver: zodResolver(trackerSchema),
    values: trackerDefaults(tracker, defaultCurrency),
  });
  const currency = useWatch({ control, name: 'currency' });
  const converting = tracker !== null && currency !== tracker.currency;

  const submit = runAsync(
    'tracker',
    handleSubmit(async (v) => {
      const input = toTrackerInput(v);
      const saved = tracker ? await update.mutateAsync({ id: tracker.id, input }) : (await create.mutateAsync({ input })).createTracker;
      onSaved?.(saved);
    }),
  );

  return (
    <YStack gap={14}>
      <TextField control={control} name="name" label="Name" placeholder="e.g. Home, Shop, Goa trip" autoCapitalize="words" />
      <ChipsField control={control} name="kind" label="What is it for?" items={KIND_ITEMS} />
      {tracker ? null : (
        <Muted fontSize={12}>Business trackers start with business categories (rent, salaries, stock…), home ones with everyday categories.</Muted>
      )}
      <CurrencyField control={control} name="currency" label="Currency (ISO 4217)" hint="Every total in this tracker is shown in it" />
      {converting ? <Muted fontSize={12}>Existing entries will be converted to {currency} using today’s exchange rates.</Muted> : null}
      <TextField
        control={control}
        name="monthlyBudget"
        label={`Monthly budget (${currency})`}
        placeholder="Leave empty to compare with income"
        keyboardType="decimal-pad"
      />
      <ErrorText error={create.error ?? update.error} />
      {update.isSuccess ? <Success>Saved</Success> : null}
      <Btn title={tracker ? 'Save changes' : 'Create tracker'} onPress={submit} loading={create.isPending || update.isPending} />
    </YStack>
  );
}
