import { Text, YStack } from 'tamagui';
import { formatDate, type DisplaySettings } from '@/lib/format';
import type { TicketMessage } from '@/lib/types';
import { C } from '@/theme/colors';

/** One message: the user's own on the right, support's replies on the left */
export function Message({ message, display }: Readonly<{ message: TicketMessage; display: DisplaySettings }>) {
  const mine = message.author === 'USER';
  const ink = mine ? C.white : C.ink;
  return (
    <YStack
      alignSelf={mine ? 'flex-end' : 'flex-start'}
      maxWidth="85%"
      backgroundColor={mine ? C.ink : C.white}
      borderRadius={18}
      borderWidth={1}
      borderColor={mine ? C.ink : C.line}
      padding={12}
      gap={4}
    >
      <Text fontSize={11} fontWeight="600" color={mine ? C.faint : C.green}>
        {mine ? 'You' : `${message.authorName} · Spentiva support`}
      </Text>
      <Text fontSize={15} color={ink} lineHeight={21}>
        {message.body}
      </Text>
      <Text fontSize={11} color={mine ? C.faint : C.sub} alignSelf="flex-end">
        {formatDate(message.createdAt, display, 'dateTime')}
      </Text>
    </YStack>
  );
}
