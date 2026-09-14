import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FiTrash2 } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { useConfirm } from '@/components/ConfirmDialog';
import { Logo } from '@/components/Logo';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import { ErrorState, ErrorText, IconButton, Loading, Muted } from '@/components/ui';
import { useCategoryMap, useChatHistory } from '@/hooks/queries';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/lib/auth';
import { logError, runAsync } from '@/lib/log';
import type { ChatMessage, ChatOption } from '@/lib/types';
import { C } from '@/theme/colors';
import { Bubble } from './Bubble';
import { Composer } from './Composer';
import { Welcome } from './Welcome';

function Thinking() {
  return (
    <XStack
      alignSelf="flex-start"
      gap={8}
      alignItems="center"
      backgroundColor={C.white}
      paddingHorizontal={14}
      paddingVertical={10}
      borderRadius={18}
      borderWidth={1}
      borderColor={C.line}
    >
      <ActivityIndicator size="small" color={C.green} />
      <Muted>Thinking…</Muted>
    </XStack>
  );
}

function ChatHeader({ onClear }: Readonly<{ onClear?: () => void }>) {
  return (
    <XStack alignItems="center" gap={12} paddingHorizontal={16} paddingVertical={10} borderBottomWidth={1} borderColor={C.line}>
      <Logo size={36} showName={false} />
      <YStack flex={1} gap={4}>
        <Text fontSize={17} fontWeight="800" color={C.ink}>
          Spentiva AI
        </Text>
        <TrackerSwitcher />
      </YStack>
      {onClear ? <IconButton icon={FiTrash2} plain onPress={onClear} label="Clear chat" /> : null}
    </XStack>
  );
}

/** Chat: log expenses/income in plain language, pick options when unsure, get charts */
export default function ChatScreen() {
  const user = useUser();
  const confirm = useConfirm();
  const { data: messages, isLoading, error, refetch } = useChatHistory();
  const { send, choose, clear } = useChat();
  const categories = useCategoryMap();
  const [text, setText] = useState('');
  const inverted = useMemo(() => [...(messages ?? [])].reverse(), [messages]);
  const busy = send.isPending || choose.isPending;

  const submit = useCallback(
    (value?: string) => {
      const message = (value ?? text).trim();
      if (!message || send.isPending) return;
      setText('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(logError('haptics'));
      send.mutate(message);
    },
    [text, send],
  );

  const onOption = useCallback(
    (message: ChatMessage, option: ChatOption) => {
      if (option.action === 'PROMPT') {
        submit(option.value ?? option.label);
        return;
      }
      Haptics.selectionAsync().catch(logError('haptics'));
      choose.mutate({ messageId: message.id, optionId: option.id });
    },
    [choose, submit],
  );

  const clearChat = runAsync('chat', async () => {
    const ok = await confirm({
      title: 'Clear chat?',
      message: 'This removes the conversation. Logged transactions stay.',
      confirmLabel: 'Clear',
      destructive: true,
    });
    if (ok) await clear.mutateAsync();
  });

  let body = <ErrorState error={error} onRetry={runAsync('chat', refetch)} />;
  if (isLoading) body = <Loading label="Loading conversation…" />;
  else if (messages && inverted.length === 0 && !send.isPending) body = <Welcome name={user.name.split(' ')[0] ?? ''} onPick={submit} />;
  else if (messages) {
    body = (
      <FlatList
        inverted
        data={inverted}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <Bubble message={item} user={user} categories={categories} onOption={onOption} busy={busy} />}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        ListHeaderComponent={busy ? <Thinking /> : null}
        initialNumToRender={12}
        windowSize={9}
        removeClippedSubviews
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ChatHeader onClear={messages?.length ? clearChat : undefined} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {body}
        <YStack paddingHorizontal={16}>
          <ErrorText error={send.error ?? choose.error} />
        </YStack>
        <Composer value={text} onChange={setText} onSend={() => submit()} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
