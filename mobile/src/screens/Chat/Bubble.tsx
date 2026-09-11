import { memo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { ReportView } from '@/components/ReportView';
import { Tiny } from '@/components/ui';
import { formatDate } from '@/lib/format';
import type { Category, ChatMessage, ChatOption, User } from '@/lib/types';
import { C, tint } from '@/theme/colors';
import { OptionChip } from './OptionChip';
import { TransactionCard } from './TransactionCard';

interface BubbleProps {
  message: ChatMessage;
  user: User;
  categories: Map<string, Category>;
  busy: boolean;
  onOption: (message: ChatMessage, option: ChatOption) => void;
}

function UserBubble({ message }: Readonly<{ message: ChatMessage }>) {
  return (
    <XStack justifyContent="flex-end">
      <YStack
        backgroundColor={C.ink}
        paddingHorizontal={14}
        paddingVertical={10}
        borderRadius={20}
        borderBottomRightRadius={6}
        maxWidth="82%"
        opacity={message.pending ? 0.55 : 1}
      >
        <Text color={C.white} fontSize={15}>
          {message.text}
        </Text>
      </YStack>
    </XStack>
  );
}

function AssistantBody({ message, user, category }: Readonly<{ message: ChatMessage; user: User; category?: Category }>) {
  if (message.kind === 'TRANSACTION') return <TransactionCard message={message} user={user} category={category} />;
  return (
    <>
      <Text fontSize={15} color={message.kind === 'ERROR' ? C.red : C.ink}>
        {message.text}
      </Text>
      {message.report ? <ReportView report={message.report} locale={user.locale} height={210} compact /> : null}
    </>
  );
}

function borderFor(kind: ChatMessage['kind']) {
  if (kind === 'TRANSACTION') return tint(C.green, 0.3);
  if (kind === 'ERROR') return tint(C.red, 0.3);
  return C.line;
}

export const Bubble = memo(function Bubble({ message, user, categories, busy, onOption }: Readonly<BubbleProps>) {
  if (message.role === 'USER') return <UserBubble message={message} />;
  const isReport = message.kind === 'REPORT';
  const categoryId = message.transaction?.categoryId;
  return (
    <YStack alignSelf="flex-start" width={isReport ? '100%' : undefined} maxWidth={isReport ? '100%' : '90%'} gap={8}>
      <YStack
        backgroundColor={message.kind === 'ERROR' ? C.redSoft : C.white}
        borderRadius={20}
        borderBottomLeftRadius={6}
        padding={14}
        gap={10}
        borderWidth={1}
        borderColor={borderFor(message.kind)}
      >
        <AssistantBody message={message} user={user} category={categoryId ? categories.get(categoryId) : undefined} />
      </YStack>
      {message.options.length ? (
        <XStack flexWrap="wrap" gap={8}>
          {message.options.map((o) => (
            <OptionChip key={o.id} option={o} message={message} disabled={busy} onPress={() => onOption(message, o)} />
          ))}
        </XStack>
      ) : null}
      <Tiny paddingLeft={4}>{formatDate(message.createdAt, user, 'time')}</Tiny>
    </YStack>
  );
});
