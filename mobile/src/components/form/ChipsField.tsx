import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { IconType } from 'react-icons';
import { XStack, YStack } from 'tamagui';
import { FieldHelp, FieldLabel } from './FieldText';
import { Chip } from '../ui';

export interface ChipItem {
  value: string;
  label: string;
  icon?: IconType;
  color?: string;
}

interface ChipsFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: ChipItem[];
  /** Tapping the selected chip clears the value */
  clearable?: boolean;
  onPicked?: (value: string) => void;
}

/** Single-choice chip group bound to react-hook-form */
export function ChipsField<T extends FieldValues>({ control, name, label, items, clearable, onPicked }: Readonly<ChipsFieldProps<T>>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <YStack gap={8}>
          <FieldLabel>{label}</FieldLabel>
          <XStack flexWrap="wrap" gap={8} role="radiogroup" aria-label={label}>
            {items.map((item) => {
              const selected = field.value === item.value;
              return (
                <Chip
                  key={item.value}
                  label={item.label}
                  icon={item.icon}
                  color={item.color}
                  selected={selected}
                  onPress={() => {
                    field.onChange(selected && clearable ? null : item.value);
                    onPicked?.(item.value);
                  }}
                />
              );
            })}
          </XStack>
          <FieldHelp error={fieldState.error?.message} />
        </YStack>
      )}
    />
  );
}
