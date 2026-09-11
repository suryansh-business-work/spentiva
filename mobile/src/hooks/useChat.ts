import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChooseOptionMutation, ClearChatMutation, SendChatMutation } from '@/graphql/mutations';
import { gql } from '@/lib/api';
import { logError } from '@/lib/log';
import type { ChatMessage } from '@/lib/types';
import { keys, useInvalidateMoney } from './keys';

const CHAT_TIMEOUT_MS = 45_000;

function pendingMessage(text: string): ChatMessage {
  return {
    id: `pending-${Date.now()}`,
    role: 'USER',
    kind: 'TEXT',
    text,
    transaction: null,
    options: [],
    selectedOptionId: null,
    resolved: true,
    report: null,
    createdAt: new Date().toISOString(),
    pending: true,
  };
}

/** Send / choose / clear — results are merged into the cached history by id */
export function useChat() {
  const qc = useQueryClient();
  const invalidateMoney = useInvalidateMoney();

  const merge = (incoming: ChatMessage[], dropPending = false) =>
    qc.setQueryData<ChatMessage[]>(keys.chat, (prev = []) => {
      const base = dropPending ? prev.filter((m) => !m.pending) : prev;
      const byId = new Map(base.map((m) => [m.id, m]));
      for (const m of incoming) byId.set(m.id, m);
      const merged = [...byId.values()];
      merged.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return merged;
    });

  const refreshAfter = (messages: ChatMessage[]) => {
    if (messages.some((m) => m.kind === 'TRANSACTION' || m.resolved)) invalidateMoney().catch(logError('chat'));
    if (messages.some((m) => m.kind === 'OPTIONS' || m.kind === 'TRANSACTION')) {
      qc.invalidateQueries({ queryKey: keys.categories }).catch(logError('chat'));
      qc.invalidateQueries({ queryKey: keys.sources }).catch(logError('chat'));
    }
  };

  const send = useMutation({
    mutationFn: (text: string) => gql(SendChatMutation, { text }, CHAT_TIMEOUT_MS).then((d) => d.sendChatMessage),
    onMutate: (text) => {
      merge([pendingMessage(text)]);
    },
    onSuccess: (messages) => {
      merge(messages, true);
      refreshAfter(messages);
    },
    onError: () => qc.setQueryData<ChatMessage[]>(keys.chat, (prev = []) => prev.filter((m) => !m.pending)),
  });

  const choose = useMutation({
    mutationFn: (vars: { messageId: string; optionId: string }) => gql(ChooseOptionMutation, vars, CHAT_TIMEOUT_MS).then((d) => d.chooseChatOption),
    onSuccess: (messages) => {
      merge(messages);
      refreshAfter(messages);
    },
  });

  const clear = useMutation({
    mutationFn: () => gql(ClearChatMutation),
    onSuccess: () => qc.setQueryData(keys.chat, []),
  });

  return { send, choose, clear };
}
