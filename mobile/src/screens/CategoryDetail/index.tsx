import { router, useLocalSearchParams } from 'expo-router';
import { FiTrash2 } from 'react-icons/fi';
import { useConfirm } from '@/components/ConfirmDialog';
import { Btn, Card, EmptyState, ErrorText, Header, Loading, Screen } from '@/components/ui';
import { CategoryForm } from '@/forms/category';
import { useDeleteCategory, useUpdateCategory } from '@/hooks/mutations';
import { useCategories } from '@/hooks/queries';
import { runAsync } from '@/lib/log';
import { AppearanceCard } from './AppearanceCard';
import { ItemsCard } from './ItemsCard';

/** Edit one category: name, colour, icon, Expense On items, delete */
export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const confirm = useConfirm();
  const { data, isLoading } = useCategories();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const category = data?.find((c) => c.id === id);

  if (isLoading) return <Loading />;
  if (!category) {
    return (
      <Screen>
        <Header title="Category" back />
        <EmptyState title="Category not found" />
      </Screen>
    );
  }

  const rename = (name: string) => update.mutateAsync({ id: category.id, input: { name } });
  const restyle = (input: { color?: string; icon?: string }) => runAsync('category', () => update.mutateAsync({ id: category.id, input }))();
  const del = runAsync('category', async () => {
    const ok = await confirm({
      title: `Delete ${category.name}?`,
      message: 'Existing transactions keep their category name.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    await remove.mutateAsync({ id: category.id });
    router.back();
  });

  return (
    <Screen>
      <Header title={category.name} subtitle={category.type === 'EXPENSE' ? 'Expense category' : 'Income category'} back />
      <Card>
        <CategoryForm
          name={category.name}
          submitLabel="Save name"
          variant="ghost"
          pending={update.isPending}
          error={update.error}
          onSubmit={rename}
        />
      </Card>
      <AppearanceCard category={category} onChange={restyle} />
      <ItemsCard category={category} />
      <ErrorText error={remove.error} />
      <Btn title="Delete category" variant="danger" icon={FiTrash2} onPress={del} loading={remove.isPending} />
    </Screen>
  );
}
