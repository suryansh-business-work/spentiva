import { router } from 'expo-router';
import { Fragment, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { AppSheet } from '@/components/AppSheet';
import { iconFor } from '@/components/icons';
import { Card, Divider, EmptyState, ErrorState, H2, Header, IconButton, ListRow, Loading, Muted, Screen, Segmented } from '@/components/ui';
import { CategoryForm } from '@/forms/category';
import { useCreateCategory } from '@/hooks/mutations';
import { useCategories } from '@/hooks/queries';
import { CATEGORY_COLORS, TX_TYPE_OPTIONS } from '@/lib/constants';
import { runAsync } from '@/lib/log';
import { canEdit, useTracker } from '@/lib/tracker';
import type { Category, TxType } from '@/lib/types';

function NewCategorySheet({
  open,
  onOpenChange,
  type,
  count,
}: Readonly<{ open: boolean; onOpenChange: (o: boolean) => void; type: TxType; count: number }>) {
  const create = useCreateCategory();
  const onSubmit = async (name: string) => {
    const color = CATEGORY_COLORS[count % CATEGORY_COLORS.length];
    const { createCategory } = await create.mutateAsync({ input: { name, type, icon: 'tag', color } });
    onOpenChange(false);
    router.push({ pathname: '/settings/category/[id]', params: { id: createCategory.id } });
  };
  return (
    <AppSheet open={open} onOpenChange={onOpenChange}>
      <H2>New {type === 'EXPENSE' ? 'expense' : 'income'} category</H2>
      <CategoryForm
        placeholder={type === 'EXPENSE' ? 'e.g. Pets' : 'e.g. Rental income'}
        submitLabel="Create"
        pending={create.isPending}
        error={create.error}
        onSubmit={onSubmit}
      />
    </AppSheet>
  );
}

function CategoryList({ list }: Readonly<{ list: Category[] }>) {
  if (list.length === 0) return <EmptyState title="No categories" message="Tap + to add one." />;
  return (
    <Card gap={0} paddingVertical={6}>
      {list.map((c, i) => (
        <Fragment key={c.id}>
          {i > 0 ? <Divider /> : null}
          <ListRow
            icon={iconFor(c.icon)}
            iconColor={c.color}
            title={c.name}
            subtitle={c.items.length ? c.items.map((x) => x.name).join(', ') : 'No items yet'}
            onPress={() => router.push({ pathname: '/settings/category/[id]', params: { id: c.id } })}
          />
        </Fragment>
      ))}
    </Card>
  );
}

/** Expense / income categories and their "Expense On" items */
export default function CategoriesScreen() {
  const tracker = useTracker();
  const editable = canEdit(tracker.role);
  const [type, setType] = useState<TxType>('EXPENSE');
  const [open, setOpen] = useState(false);
  const { data, isLoading, error, refetch } = useCategories();

  let body = <ErrorState error={error} onRetry={runAsync('categories', refetch)} />;
  if (data) body = <CategoryList list={data.filter((c) => c.type === type)} />;
  else if (isLoading) body = <Loading />;

  return (
    <Screen>
      <Header
        title="Categories"
        subtitle={tracker.name}
        back
        right={editable ? <IconButton icon={FiPlus} onPress={() => setOpen(true)} label="New category" /> : null}
      />
      <Segmented value={type} onChange={setType} options={TX_TYPE_OPTIONS} />
      <Muted>Each category has its own “Expense On” items (e.g. Food → Groceries, Restaurant). The chat uses these to file your messages.</Muted>
      {body}
      <NewCategorySheet open={open} onOpenChange={setOpen} type={type} count={data?.length ?? 0} />
    </Screen>
  );
}
