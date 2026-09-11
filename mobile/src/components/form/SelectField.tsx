import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FiChevronDown } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { C } from '@/theme/colors';
import { Icon } from '../Icon';
import { SelectSheet, type SelectItem } from '../SelectSheet';
import { FieldHelp, FieldLabel } from './FieldText';

interface SelectFieldProps {
  label?: string;
  title: string;
  value?: string | null;
  display?: string | null;
  placeholder: string;
  items: SelectItem[];
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  searchable?: boolean;
  disabled?: boolean;
  icon?: IconType;
}

/** A field that opens a searchable bottom-sheet list */
export function SelectField({
  label,
  title,
  value,
  display,
  placeholder,
  items,
  onChange,
  error,
  hint,
  searchable,
  disabled,
  icon = FiChevronDown,
}: Readonly<SelectFieldProps>) {
  const [open, setOpen] = useState(false);
  const text = display ?? items.find((i) => i.value === value)?.label ?? value;
  return (
    <YStack gap={6}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <XStack
        height={52}
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={16}
        borderRadius={16}
        borderWidth={1}
        borderColor={error ? C.red : C.line}
        backgroundColor={C.white}
        opacity={disabled ? 0.55 : 1}
        pressStyle={{ backgroundColor: C.bg }}
        onPress={disabled ? undefined : () => setOpen(true)}
        role="button"
        aria-label={label ?? title}
      >
        <Text fontSize={15} color={text ? C.ink : C.faint} numberOfLines={1} flex={1}>
          {text ?? placeholder}
        </Text>
        <Icon as={icon} size={18} color={C.sub} />
      </XStack>
      <FieldHelp error={error} hint={hint} />
      <SelectSheet open={open} onOpenChange={setOpen} title={title} items={items} value={value} onSelect={onChange} searchable={searchable} />
    </YStack>
  );
}
