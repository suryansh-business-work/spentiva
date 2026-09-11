import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native';
import { FiTrash2, FiX } from 'react-icons/fi';
import { useConfirm } from '@/components/ConfirmDialog';
import { Btn, ErrorState, ErrorText, Header, IconButton, Loading, Screen } from '@/components/ui';
import { TransactionForm } from '@/forms/transaction';
import { useDeleteTransaction } from '@/hooks/mutations';
import { useTransaction } from '@/hooks/queries';
import { useUser } from '@/lib/auth';
import { runAsync } from '@/lib/log';
import { C } from '@/theme/colors';

/** Add (no id) or edit/delete (with ?id=) an entry */
export default function TransactionScreen() {
  const user = useUser();
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

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen edges={['top', 'bottom']}>
        <Header title={id ? 'Edit entry' : 'New entry'} right={<IconButton icon={FiX} plain onPress={() => router.back()} label="Close" />} />
        <TransactionForm user={user} existing={existing.data} onDone={() => router.back()} />
        {id ? <Btn title="Delete" variant="danger" icon={FiTrash2} onPress={onDelete} loading={remove.isPending} /> : null}
        <ErrorText error={remove.error} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
