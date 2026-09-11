import { useMemo, useState, type ReactNode } from 'react';
import { FiCheck, FiSearch } from 'react-icons/fi';
import { Input, Sheet, Text, XStack, YStack } from 'tamagui';
import { C } from '@/theme/colors';
import { AppSheet } from './AppSheet';
import { Icon } from './Icon';

export interface SelectItem {
  value: string;
  label: string;
  subtitle?: string;
  left?: ReactNode;
}

interface SelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: SelectItem[];
  value?: string | null;
  onSelect: (value: string) => void;
  searchable?: boolean;
}

function SelectRow({ item, selected, onPress }: Readonly<{ item: SelectItem; selected: boolean; onPress: () => void }>) {
  return (
    <XStack
      alignItems="center"
      gap={12}
      paddingVertical={13}
      paddingHorizontal={6}
      borderBottomWidth={1}
      borderColor={C.line}
      pressStyle={{ backgroundColor: C.bg }}
      onPress={onPress}
      role="option"
      aria-selected={selected}
    >
      {item.left}
      <YStack flex={1}>
        <Text fontSize={15} fontWeight={selected ? '700' : '500'} color={C.ink}>
          {item.label}
        </Text>
        {item.subtitle ? (
          <Text fontSize={12} color={C.sub}>
            {item.subtitle}
          </Text>
        ) : null}
      </YStack>
      {selected ? <Icon as={FiCheck} size={18} color={C.green} /> : null}
    </XStack>
  );
}

/** Bottom-sheet list picker with optional search (currencies, time zones, months, channels…) */
export function SelectSheet({ open, onOpenChange, title, items, value, onSelect, searchable }: Readonly<SelectSheetProps>) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.subtitle ?? ''} ${i.value}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const change = (next: boolean) => {
    onOpenChange(next);
    if (!next) setQuery('');
  };

  return (
    <AppSheet open={open} onOpenChange={change} heightPercent={82}>
      <Text fontSize={18} fontWeight="800" color={C.ink}>
        {title}
      </Text>
      {searchable ? (
        <XStack alignItems="center" backgroundColor={C.pill} borderRadius={14} paddingHorizontal={12} gap={8}>
          <Icon as={FiSearch} size={16} color={C.sub} />
          <Input
            flex={1}
            unstyled
            height={44}
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={C.faint as never}
            color={C.ink}
            fontSize={15}
            autoCorrect={false}
            aria-label="Search"
          />
        </XStack>
      ) : null}
      <Sheet.ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <YStack paddingBottom={40} role="list">
          {filtered.map((item) => (
            <SelectRow
              key={item.value}
              item={item}
              selected={item.value === value}
              onPress={() => {
                onSelect(item.value);
                change(false);
              }}
            />
          ))}
          {filtered.length === 0 ? (
            <Text color={C.sub} textAlign="center" paddingVertical={24}>
              No matches
            </Text>
          ) : null}
        </YStack>
      </Sheet.ScrollView>
    </AppSheet>
  );
}
