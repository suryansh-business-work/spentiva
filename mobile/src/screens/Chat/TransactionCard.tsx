import { Text, XStack, YStack } from 'tamagui';
import { iconFor } from '@/components/icons';
import { IconBadge, Tiny } from '@/components/ui';
import { formatDate, money } from '@/lib/format';
import type { Category, ChatMessage, User } from '@/lib/types';
import { C } from '@/theme/colors';

interface TransactionCardProps {
  message: ChatMessage;
  user: User;
  category?: Category;
}

/** The entry logged from a chat message (struck through once undone) */
export function TransactionCard({ message, user, category }: Readonly<TransactionCardProps>) {
  const tx = message.transaction;
  if (!tx) {
    return (
      <Text fontSize={14} color={C.sub} textDecorationLine="line-through">
        {message.text}
      </Text>
    );
  }
  const income = tx.type === 'INCOME';
  const sign = income ? '+' : '−';
  const via = income ? 'Received in' : 'Paid via';
  return (
    <YStack gap={10}>
      <XStack alignItems="center" gap={12}>
        <IconBadge icon={iconFor(category?.icon)} color={category?.color ?? C.green} size={44} />
        <YStack flex={1}>
          <Text fontSize={15} fontWeight="700" color={C.ink} numberOfLines={1}>
            {[tx.categoryName, tx.expenseOnName].filter(Boolean).join(' · ')}
          </Text>
          <Tiny color={C.sub}>
            {via} {tx.sourceName ?? '—'} · {formatDate(tx.occurredAt, user, 'dateTime')}
          </Tiny>
        </YStack>
        <Text fontSize={18} fontWeight="800" color={income ? C.green : C.ink}>
          {sign}
          {money(tx.amount, tx.currency, user.locale)}
        </Text>
      </XStack>
      {tx.currency === tx.baseCurrency ? null : (
        <Tiny>
          ≈ {money(tx.amountBase, tx.baseCurrency, user.locale)} at {tx.fxRate.toFixed(4)}
        </Tiny>
      )}
      {tx.note ? <Tiny color={C.sub}>“{tx.note}”</Tiny> : null}
    </YStack>
  );
}
