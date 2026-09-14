import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native';
import { FiTrash2, FiX } from 'react-icons/fi';
import { useConfirm } from '@/components/ConfirmDialog';
import { TransactionRow } from '@/components/TransactionRow';
import { Btn, Card, ErrorState, ErrorText, Header, IconButton, Loading, Muted, Screen } from '@/components/ui';
import { TransactionForm } from '@/forms/transaction';
import { useDeleteTransaction } from '@/hooks/mutations';
import { useCategoryMap, useTransaction } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import { canEdit, useTracker } from '@/lib/tracker';
import type { Transaction, User } from '@/lib/types';
import { C } from '@/theme/colors';

const CloseButton = () => <IconButton icon={FiX} plain onPress={() => router.back()} label="Close" />;

/** Viewers of a shared tracker see the entry but can't change it */
function ViewOnlyEntry({ tx, user, trackerName }: Readonly<{ tx?: Transaction | null; user: User; trackerName: string }>) {
  const categories = useCategoryMap();
  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Entry" right={<CloseButton />} />
      {tx ? (
        <Card gap={0} paddingVertical={6}>
          <TransactionRow tx={tx} user={user} category={tx.categoryId ? categories.get(tx.categoryId) : undefined} showDate />
        </Card>
      ) : null}
      <Muted>You have view-only access to “{trackerName}”. Ask its owner for edit access to add or change entries.</Muted>
    </Screen>
  );
}

/** Add (no id) or edit/delete (with ?id=) an entry */
export default function TransactionScreen() {
  const user = useUser();
  const tracker = useTracker();
  const confirm = useConfirm();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useTransaction(id);
  const remove = useDeleteTransaction();

  const onDelete = runAsync('transaction', async () => {
    if (!id) return;
    const ok = await confirm({ title: 'Delete this entry?', message: 'This cannot be undone.', confirmLabel: 'Delete', destructive: true });
    if (!ok) return;
    await remove.mutateAsync(id);
    router.back();
  });

  if (id && existing.isLoading) return <Loading />;
  if (id && !existing.data)
    return <ErrorState error={existing.error ?? new Error('Entry not found')} onRetry={runAsync('transaction', existing.refetch)} />;
  if (!canEdit(tracker.role)) return <ViewOnlyEntry tx={existing.data} user={user} trackerName={tracker.name} />;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen edges={['top', 'bottom']}>
        <Header title={id ? 'Edit entry' : 'New entry'} right={<CloseButton />} />
        <TransactionForm user={user} existing={existing.data} onDone={() => router.back()} />
        {id ? <Btn title="Delete" variant="danger" icon={FiTrash2} onPress={onDelete} loading={remove.isPending} /> : null}
        <ErrorText error={remove.error} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
