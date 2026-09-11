import { addDays, format, parseISO, subDays } from 'date-fns';
import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { FieldLabel } from '@/components/form';
import { Chip, IconButton } from '@/components/ui';
import { formatKey, localDateKey, type DisplaySettings } from '@/lib/format';
import { C } from '@/theme/colors';
import type { TransactionValues } from '../transaction.types';

const KEY = 'yyyy-MM-dd';
const shift = (key: string, days: number) => format(addDays(parseISO(key), days), KEY);

interface DateFieldProps {
  control: Control<TransactionValues>;
  settings: DisplaySettings;
}

/** Today / Yesterday shortcuts and a day stepper (no future dates) */
export function DateField({ control, settings }: Readonly<DateFieldProps>) {
  const [today] = useState(() => localDateKey(Date.now(), settings.timezone));
  const yesterday = format(subDays(parseISO(today), 1), KEY);
  return (
    <Controller
      control={control}
      name="date"
      render={({ field }) => {
        const atToday = field.value >= today;
        return (
          <YStack gap={8}>
            <FieldLabel>Date</FieldLabel>
            <XStack gap={8}>
              <Chip label="Today" selected={field.value === today} onPress={() => field.onChange(today)} />
              <Chip label="Yesterday" selected={field.value === yesterday} onPress={() => field.onChange(yesterday)} />
            </XStack>
            <XStack
              alignItems="center"
              justifyContent="space-between"
              backgroundColor={C.white}
              borderRadius={16}
              borderWidth={1}
              borderColor={C.line}
              padding={6}
            >
              <IconButton icon={FiChevronLeft} plain onPress={() => field.onChange(shift(field.value, -1))} label="Previous day" />
              <Text fontSize={15} fontWeight="700" color={C.ink}>
                {formatKey(field.value, settings, 'longDay')}
              </Text>
              <IconButton
                icon={FiChevronRight}
                plain
                color={atToday ? C.faint : C.ink}
                onPress={atToday ? undefined : () => field.onChange(shift(field.value, 1))}
                label="Next day"
              />
            </XStack>
          </YStack>
        );
      }}
    />
  );
}
