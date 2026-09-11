import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { ChipsField, TextField } from '@/components/form';
import { Btn, ErrorText, Success } from '@/components/ui';
import { useShareTracker } from '@/hooks/trackerMutations';
import { MEMBER_ROLE_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import { shareTrackerDefaults, shareTrackerSchema, type ShareTrackerValues } from './share-tracker.types';

/** Owner only: give another Spentiva user access to this tracker */
export function ShareTrackerForm({ trackerId }: Readonly<{ trackerId: string }>) {
  const share = useShareTracker();
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<ShareTrackerValues>({
    resolver: zodResolver(shareTrackerSchema),
    defaultValues: shareTrackerDefaults,
    mode: 'onTouched',
  });

  const submit = runAsync(
    'share',
    handleSubmit(async (v) => {
      setSharedWith(null);
      await share.mutateAsync({ id: trackerId, email: v.email, role: v.role });
      setSharedWith(v.email);
      reset(shareTrackerDefaults);
    }),
  );

  return (
    <YStack gap={12}>
      <TextField
        control={control}
        name="email"
        label="Their email"
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        hint="They need a Spentiva account with this email"
      />
      <ChipsField control={control} name="role" label="They can" items={MEMBER_ROLE_OPTIONS} />
      <ErrorText error={share.error} />
      {sharedWith ? <Success>Shared with {sharedWith}. They’ll find it in their tracker list.</Success> : null}
      <Btn title="Share tracker" onPress={submit} loading={share.isPending} height={48} />
    </YStack>
  );
}
