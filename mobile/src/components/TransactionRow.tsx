import { memo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { formatDate, money } from '@/lib/format';
import type { Category, Transaction, User } from '@/lib/types';
import { C } from '@/theme/colors';
import { iconFor } from './icons';
import { IconBadge } from './ui';

interface TransactionRowProps {
  tx: Transaction;
  category?: Category;
  user: User;
  onPress?: () => void;
  showDate?: boolean;
}

function title(tx: Transaction) {
  return tx.note && !tx.expenseOnName ? `${tx.categoryName} · ${tx.note}` : tx.categoryName;
}

export const TransactionRow = memo(function TransactionRow({ tx, category, user, onPress, showDate }: Readonly<TransactionRowProps>) {
  const income = tx.type === 'INCOME';
  const when = formatDate(tx.occurredAt, user, showDate ? 'dateTime' : 'time');
  const meta = [tx.expenseOnName, tx.sourceName, when].filter(Boolean).join(' · ');
  const sign = income ? '+' : '−';
  return (
    <XStack alignItems="center" gap={12} paddingVertical={10} pressStyle={onPress ? { opacity: 0.6 } : undefined} onPress={onPress} role="button">
      <IconBadge icon={iconFor(category?.icon)} color={category?.color ?? C.sub} size={42} />
      <YStack flex={1} gap={2}>
        <Text fontSize={15} fontWeight="600" color={C.ink} numberOfLines={1}>
          {title(tx)}
        </Text>
        <Text fontSize={12} color={C.sub} numberOfLines={1}>
          {meta}
        </Text>
      </YStack>
      <YStack alignItems="flex-end" gap={2}>
        <Text fontSize={15} fontWeight="700" color={income ? C.green : C.ink}>
          {sign}
          {money(tx.amount, tx.currency, user.locale)}
        </Text>
        {tx.currency === tx.baseCurrency ? null : (
          <Text fontSize={11} color={C.faint}>
            ≈ {money(tx.amountBase, tx.baseCurrency, user.locale)}
          </Text>
        )}
      </YStack>
    </XStack>
  );
});
