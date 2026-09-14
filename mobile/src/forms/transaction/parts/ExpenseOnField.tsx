import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { Input, XStack, YStack } from 'tamagui';
import { ChipsField } from '@/components/form';
import { ErrorText, IconButton } from '@/components/ui';
import { useAddExpenseOn } from '@/hooks/mutations';
import { runAsync } from '@/lib/log';
import type { Category } from '@/lib/types';
import { C } from '@/theme/colors';
import type { TransactionValues } from '../transaction.types';

interface ExpenseOnFieldProps {
  control: Control<TransactionValues>;
  category: Category;
  label: string;
  onAdded: (itemId: string) => void;
}

/** "Expense On" items of the chosen category, with inline "add new" */
export function ExpenseOnField({ control, category, label, onAdded }: Readonly<ExpenseOnFieldProps>) {
  const addItem = useAddExpenseOn();
  const [name, setName] = useState('');

  const add = runAsync('expense-on', async () => {
    const value = name.trim();
    if (!value) return;
    const { addExpenseOn } = await addItem.mutateAsync({ categoryId: category.id, name: value });
    const created = addExpenseOn.items.find((i) => i.name.toLowerCase() === value.toLowerCase());
    if (created) onAdded(created.id);
    setName('');
  });

  return (
    <YStack gap={8}>
      <ChipsField control={control} name="expenseOnId" label={label} clearable items={category.items.map((i) => ({ value: i.id, label: i.name }))} />
      <XStack alignItems="center" gap={8}>
        <Input
          flex={1}
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholder={`Add to ${category.name}…`}
          placeholderTextColor={C.faint as never}
          backgroundColor={C.white}
          borderColor={C.line}
          borderRadius={14}
          height={44}
          fontSize={14}
          color={C.ink}
          aria-label={`New item for ${category.name}`}
        />
        <IconButton icon={FiPlus} onPress={add} label="Add item" />
      </XStack>
      <ErrorText error={addItem.error} />
    </YStack>
  );
}
