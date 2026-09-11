import { useMemo, useState } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import { Text } from 'tamagui';
import { formatKey, recentMonths, type DisplaySettings } from '@/lib/format';
import { C } from '@/theme/colors';
import { Icon } from './Icon';
import { SelectSheet } from './SelectSheet';
import { Pill } from './ui';

interface MonthPickerProps {
  value: string;
  onChange: (month: string) => void;
  settings: DisplaySettings;
  compact?: boolean;
  bg?: string;
}

/** "January 2025 ▾" pill that opens a month list (months are YYYY-MM in the user's zone) */
export function MonthPicker({ value, onChange, settings, compact, bg = C.pill }: Readonly<MonthPickerProps>) {
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () => recentMonths(settings.timezone, 24).map((key) => ({ value: key, label: formatKey(key, settings, 'month') })),
    [settings],
  );
  const label = formatKey(value, settings, compact ? 'monthShort' : 'month');
  return (
    <>
      <Pill
        onPress={() => setOpen(true)}
        backgroundColor={bg}
        alignSelf={compact ? 'flex-start' : 'stretch'}
        justifyContent="center"
        role="button"
        aria-label={`Month: ${label}`}
      >
        {compact ? null : <Icon as={FiCalendar} size={16} color={C.ink} />}
        <Text fontSize={compact ? 20 : 15} fontWeight={compact ? '700' : '600'} color={C.ink}>
          {label}
        </Text>
        <Icon as={FiChevronDown} size={compact ? 20 : 16} color={C.ink} />
      </Pill>
      <SelectSheet open={open} onOpenChange={setOpen} title="Select month" items={items} value={value} onSelect={onChange} />
    </>
  );
}
