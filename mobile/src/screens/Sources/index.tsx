import { Fragment, useState } from 'react';
import { FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import { XStack } from 'tamagui';
import { AppSheet } from '@/components/AppSheet';
import { useConfirm } from '@/components/ConfirmDialog';
import { iconFor } from '@/components/icons';
import { Btn, Card, Divider, EmptyState, ErrorState, ErrorText, Header, IconButton, ListRow, Loading, Muted, Screen } from '@/components/ui';
import { SourceForm, toSourceInput } from '@/forms/source';
import { useDeleteSource, useUpdateSource } from '@/hooks/mutations';
import { useSources } from '@/hooks/queries';
import { runAsync } from '@/lib/log';
import type { PaymentSource } from '@/lib/types';

function SourceActions({ source, onDone }: Readonly<{ source: PaymentSource; onDone: () => void }>) {
  const confirm = useConfirm();
  const update = useUpdateSource();
  const remove = useDeleteSource();
  const makeDefault = runAsync('source', async () => {
    await update.mutateAsync({ id: source.id, input: toSourceInput({ name: source.name, icon: source.icon }, true) });
    onDone();
  });
  const del = runAsync('source', async () => {
    if (
      !(await confirm({
        title: `Delete ${source.name}?`,
        message: 'Existing transactions keep the name.',
        confirmLabel: 'Delete',
        destructive: true,
      }))
    )
      return;
    await remove.mutateAsync({ id: source.id });
    onDone();
  });
  return (
    <>
      <XStack gap={10}>
        {source.isDefault ? null : (
          <Btn title="Make default" variant="ghost" icon={FiStar} flex={1} height={46} onPress={makeDefault} loading={update.isPending} />
        )}
        <Btn title="Delete" variant="danger" icon={FiTrash2} flex={1} height={46} onPress={del} loading={remove.isPending} />
      </XStack>
      <ErrorText error={update.error ?? remove.error} />
    </>
  );
}

/** Payment modes ("Expense From"): Credit card, Debit card, UPI, Cash … */
export default function SourcesScreen() {
  const { data, isLoading, error, refetch } = useSources();
  const [editing, setEditing] = useState<PaymentSource | null>(null);
  const [open, setOpen] = useState(false);
  const openSheet = (source: PaymentSource | null) => {
    setEditing(source);
    setOpen(true);
  };
  const close = () => setOpen(false);

  let body = <ErrorState error={error} onRetry={runAsync('sources', refetch)} />;
  if (isLoading) body = <Loading />;
  else if (data?.length === 0) body = <EmptyState title="No payment modes" message="Tap + to add Credit Card, Debit Card, UPI…" />;
  else if (data) {
    body = (
      <Card gap={0} paddingVertical={6}>
        {data.map((s, i) => (
          <Fragment key={s.id}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              icon={iconFor(s.icon)}
              iconColor="#3B82F6"
              title={s.name}
              subtitle={s.isDefault ? 'Default' : null}
              onPress={() => openSheet(s)}
            />
          </Fragment>
        ))}
      </Card>
    );
  }

  return (
    <Screen>
      <Header title="Expense From" back right={<IconButton icon={FiPlus} onPress={() => openSheet(null)} label="Add payment mode" />} />
      <Muted>Cards, UPI, cash, wallets — whatever you pay with. The default is used when a chat message doesn’t mention one.</Muted>
      {body}
      <AppSheet open={open} onOpenChange={setOpen}>
        <SourceForm key={editing?.id ?? 'new'} source={editing} onDone={close} />
        {editing ? <SourceActions source={editing} onDone={close} /> : null}
      </AppSheet>
    </Screen>
  );
}
