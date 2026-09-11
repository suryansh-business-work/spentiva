import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, ErrorText, H2, Muted } from '@/components/ui';
import { useUpdateTracker } from '@/hooks/trackerMutations';
import { runAsync } from '@/lib/log';
import { budgetDefaults, budgetSchema, toMonthlyBudget, type BudgetValues } from './budget.types';

interface BudgetFormProps {
  trackerId: string;
  currency: string;
  current: number | null;
  onDone: () => void;
}

/** Monthly budget of a tracker (empty = track against income) */
export function BudgetForm({ trackerId, currency, current, onDone }: Readonly<BudgetFormProps>) {
  const update = useUpdateTracker();
  const { control, handleSubmit } = useForm<BudgetValues>({ resolver: zodResolver(budgetSchema), values: budgetDefaults(current) });

  const submit = runAsync(
    'budget',
    handleSubmit(async (v) => {
      await update.mutateAsync({ id: trackerId, input: { monthlyBudget: toMonthlyBudget(v) } });
      onDone();
    }),
  );

  return (
    <YStack gap={14}>
      <H2>Monthly budget</H2>
      <Muted>How much do you plan to spend each month? Leave empty to track against your income.</Muted>
      <TextField control={control} name="amount" label={`Amount (${currency})`} placeholder="e.g. 30000" keyboardType="decimal-pad" />
      <ErrorText error={update.error} />
      <Btn title="Save budget" onPress={submit} loading={update.isPending} />
    </YStack>
  );
}
