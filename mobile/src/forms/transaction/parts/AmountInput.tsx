import { Controller, useWatch, type Control } from 'react-hook-form';
import { Input, Text, XStack, YStack } from 'tamagui';
import { FieldHelp } from '@/components/form';
import { currencySymbol } from '@/lib/format';
import { C } from '@/theme/colors';
import type { TransactionValues } from '../transaction.types';

interface AmountInputProps {
  control: Control<TransactionValues>;
  locale: string;
  autoFocus?: boolean;
}

/** Large centred amount with the selected currency's symbol */
export function AmountInput({ control, locale, autoFocus }: Readonly<AmountInputProps>) {
  const currency = useWatch({ control, name: 'currency' });
  return (
    <Controller
      control={control}
      name="amount"
      render={({ field, fieldState }) => (
        <YStack alignItems="center" paddingVertical={8} gap={4}>
          <XStack alignItems="center" gap={6}>
            <Text fontSize={34} fontWeight="800" color={C.sub}>
              {currencySymbol(currency, locale)}
            </Text>
            <Input
              unstyled
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="0"
              placeholderTextColor={C.faint as never}
              keyboardType="decimal-pad"
              fontSize={44}
              fontWeight="800"
              color={C.ink}
              minWidth={120}
              textAlign="center"
              autoFocusNative={autoFocus}
              aria-label="Amount"
            />
          </XStack>
          <FieldHelp error={fieldState.error?.message} />
        </YStack>
      )}
    />
  );
}
