import { router } from 'expo-router';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Input, Text, XStack, YStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { MonthPicker } from '@/components/MonthPicker';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import { IconButton, Segmented, Title } from '@/components/ui';
import { useDashboard } from '@/hooks/queries';
import { money } from '@/lib/format';
import type { TxType, User } from '@/lib/types';
import { C } from '@/theme/colors';

export type TypeFilter = 'ALL' | TxType;

const TYPE_FILTERS = [
  { value: 'ALL' as const, label: 'All' },
  { value: 'EXPENSE' as const, label: 'Expense' },
  { value: 'INCOME' as const, label: 'Income' },
];

function MonthTotals({ month, user }: Readonly<{ month: string; user: User }>) {
  const { data } = useDashboard(month);
  if (!data) return null;
  const tiles = [
    { label: 'Income', value: data.income, color: C.green },
    { label: 'Expense', value: data.expense, color: C.red },
    { label: 'Net', value: data.savings, color: C.ink },
  ];
  return (
    <XStack gap={10}>
      {tiles.map((t) => (
        <YStack key={t.label} flex={1} backgroundColor={C.white} borderRadius={18} padding={12} borderWidth={1} borderColor={C.line}>
          <Text fontSize={11} color={C.sub}>
            {t.label}
          </Text>
          <Text fontSize={15} fontWeight="800" color={t.color} numberOfLines={1} adjustsFontSizeToFit>
            {money(t.value, data.currency, user.locale)}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
}

interface SpendingFiltersProps {
  user: User;
  month: string;
  onMonth: (m: string) => void;
  type: TypeFilter;
  onType: (t: TypeFilter) => void;
  search: string;
  onSearch: (s: string) => void;
  canAdd: boolean;
}

export function SpendingFilters({ user, month, onMonth, type, onType, search, onSearch, canAdd }: Readonly<SpendingFiltersProps>) {
  return (
    <YStack paddingHorizontal={16} paddingTop={6} gap={12}>
      <XStack alignItems="center" justifyContent="space-between">
        <Title>Spending</Title>
        {canAdd ? <IconButton icon={FiPlus} onPress={() => router.push('/transaction')} label="Add transaction" /> : null}
      </XStack>
      <TrackerSwitcher />
      <MonthPicker value={month} onChange={onMonth} settings={user} />
      <MonthTotals month={month} user={user} />
      <XStack alignItems="center" backgroundColor={C.white} borderRadius={16} paddingHorizontal={14} gap={8} borderWidth={1} borderColor={C.line}>
        <Icon as={FiSearch} size={16} color={C.sub} />
        <Input
          flex={1}
          unstyled
          height={46}
          value={search}
          onChangeText={onSearch}
          placeholder="Search note, category, payment mode"
          placeholderTextColor={C.faint as never}
          color={C.ink}
          fontSize={14}
          aria-label="Search transactions"
        />
      </XStack>
      <Segmented value={type} onChange={onType} options={TYPE_FILTERS} />
    </YStack>
  );
}
