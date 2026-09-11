import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { YStack } from 'tamagui';
import { CurrencyField, TextField } from '@/components/form';
import { iconFor } from '@/components/icons';
import { Btn, ErrorText, Segmented } from '@/components/ui';
import { useSaveTransaction } from '@/hooks/mutations';
import { useCategories, useSources } from '@/hooks/queries';
import { TX_TYPE_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import type { Transaction, User } from '@/lib/types';
import { AmountInput } from './parts/AmountInput';
import { ChipsField } from './parts/ChipsField';
import { DateField } from './parts/DateField';
import { ExpenseOnField } from './parts/ExpenseOnField';
import { fromTransaction, toTransactionInput, transactionDefaults, transactionSchema, type TransactionValues } from './transaction.types';

interface TransactionFormProps {
  user: User;
  existing?: Transaction | null;
  onDone: () => void;
}

const COPY = {
  EXPENSE: { category: 'Expense category', item: 'Expense on', source: 'Expense from', submit: 'Add expense' },
  INCOME: { category: 'Income category', item: 'Received for', source: 'Received in', submit: 'Add income' },
};

/** Manual add / edit of an expense or income entry */
export function TransactionForm({ user, existing, onDone }: Readonly<TransactionFormProps>) {
  const { data: categories } = useCategories();
  const { data: sources } = useSources();
  const save = useSaveTransaction();
  const defaultSource = sources?.find((s) => s.isDefault)?.id ?? sources?.[0]?.id ?? null;

  const { control, handleSubmit, setValue, reset } = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transactionDefaults(user.currency, user.timezone, defaultSource),
  });

  useEffect(() => {
    if (existing) reset(fromTransaction(existing, user.timezone));
  }, [existing, reset, user.timezone]);

  useEffect(() => {
    if (!existing && defaultSource) setValue('sourceId', defaultSource);
  }, [existing, defaultSource, setValue]);

  const [type, categoryId] = useWatch({ control, name: ['type', 'categoryId'] });
  const copy = COPY[type];
  const visible = useMemo(() => (categories ?? []).filter((c) => c.type === type), [categories, type]);
  const category = visible.find((c) => c.id === categoryId);

  const submit = runAsync(
    'transaction',
    handleSubmit(async (values) => {
      await save.mutateAsync({ id: existing?.id, input: toTransactionInput(values, user.timezone, existing?.occurredAt) });
      onDone();
    }),
  );

  return (
    <YStack gap={16}>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Segmented
            value={field.value}
            options={TX_TYPE_OPTIONS}
            onChange={(next) => {
              field.onChange(next);
              setValue('categoryId', '');
              setValue('expenseOnId', null);
            }}
          />
        )}
      />
      <AmountInput control={control} locale={user.locale} autoFocus={!existing} />
      <CurrencyField control={control} name="currency" label="Currency (ISO 4217)" />
      <ChipsField
        control={control}
        name="categoryId"
        label={copy.category}
        items={visible.map((c) => ({ value: c.id, label: c.name, icon: iconFor(c.icon), color: c.color }))}
        onPicked={() => setValue('expenseOnId', null)}
      />
      {category ? <ExpenseOnField control={control} category={category} label={copy.item} onAdded={(id) => setValue('expenseOnId', id)} /> : null}
      <ChipsField
        control={control}
        name="sourceId"
        label={copy.source}
        items={(sources ?? []).map((s) => ({ value: s.id, label: s.name, icon: iconFor(s.icon) }))}
      />
      <DateField control={control} settings={user} />
      <TextField
        control={control}
        name="note"
        label="Note (optional)"
        placeholder="e.g. dinner with team"
        maxLength={200}
        hint="Up to 200 characters"
      />
      <ErrorText error={save.error} />
      <Btn title={existing ? 'Save changes' : copy.submit} onPress={submit} loading={save.isPending} />
    </YStack>
  );
}
