import { Fragment, useState } from 'react';
import { FiCheck, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { Input, Text, XStack } from 'tamagui';
import { Card, Divider, ErrorText, H3, IconButton, Muted } from '@/components/ui';
import { useAddExpenseOn, useRemoveExpenseOn, useRenameExpenseOn } from '@/hooks/mutations';
import { runAsync } from '@/lib/log';
import type { Category, ExpenseOn } from '@/lib/types';
import { C } from '@/theme/colors';

const INPUT = { backgroundColor: C.bg, borderWidth: 0, borderRadius: 12, fontSize: 15, color: C.ink } as const;

function ItemRow({ categoryId, item }: Readonly<{ categoryId: string; item: ExpenseOn }>) {
  const rename = useRenameExpenseOn();
  const remove = useRemoveExpenseOn();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);

  const save = runAsync('expense-on', async () => {
    const name = value.trim();
    if (name && name !== item.name) await rename.mutateAsync({ categoryId, itemId: item.id, name });
    setEditing(false);
  });
  const del = runAsync('expense-on', () => remove.mutateAsync({ categoryId, itemId: item.id }));

  return (
    <XStack alignItems="center" gap={8} paddingVertical={8}>
      {editing ? (
        <Input flex={1} height={40} value={value} onChangeText={setValue} autoFocusNative onSubmitEditing={save} aria-label="Item name" {...INPUT} />
      ) : (
        <Text flex={1} fontSize={15} color={C.ink}>
          {item.name}
        </Text>
      )}
      <IconButton
        icon={editing ? FiCheck : FiEdit2}
        size={36}
        plain
        onPress={editing ? save : () => setEditing(true)}
        label={`Rename ${item.name}`}
      />
      <IconButton icon={FiX} size={36} plain color={C.red} onPress={del} label={`Remove ${item.name}`} />
    </XStack>
  );
}

/** "Expense On" items of a category: add, rename, remove */
export function ItemsCard({ category }: Readonly<{ category: Category }>) {
  const add = useAddExpenseOn();
  const [name, setName] = useState('');
  const submit = runAsync('expense-on', async () => {
    const value = name.trim();
    if (!value) return;
    await add.mutateAsync({ categoryId: category.id, name: value });
    setName('');
  });

  return (
    <Card gap={4}>
      <H3>{category.type === 'EXPENSE' ? 'Expense On items' : 'Income items'}</H3>
      <Muted>The chat matches these (e.g. “petrol” → Transport · Fuel). Missing ones can be added from the chat too.</Muted>
      {category.items.length === 0 ? <Muted paddingVertical={10}>No items yet.</Muted> : null}
      {category.items.map((item, i) => (
        <Fragment key={item.id}>
          {i > 0 ? <Divider /> : null}
          <ItemRow categoryId={category.id} item={item} />
        </Fragment>
      ))}
      <XStack alignItems="center" gap={8} marginTop={8}>
        <Input
          flex={1}
          height={46}
          value={name}
          onChangeText={setName}
          placeholder="Add an item, e.g. Groceries"
          placeholderTextColor={C.faint as never}
          onSubmitEditing={submit}
          aria-label="New item"
          {...INPUT}
        />
        <IconButton icon={FiPlus} onPress={submit} label="Add item" />
      </XStack>
      <ErrorText error={add.error} />
    </Card>
  );
}
