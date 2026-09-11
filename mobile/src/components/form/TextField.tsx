import { useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Input, XStack, YStack, type InputProps } from 'tamagui';
import { C } from '@/theme/colors';
import { Icon } from '../Icon';
import { FieldHelp, FieldLabel } from './FieldText';

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  hint?: string;
} & Omit<InputProps, 'value' | 'onChangeText' | 'onBlur'>;

function RevealToggle({ hidden, onToggle }: Readonly<{ hidden: boolean; onToggle: () => void }>) {
  return (
    <YStack
      position="absolute"
      right={14}
      padding={4}
      onPress={onToggle}
      pressStyle={{ opacity: 0.6 }}
      role="button"
      aria-label={hidden ? 'Show' : 'Hide'}
    >
      <Icon as={hidden ? FiEye : FiEyeOff} size={18} color={C.sub} />
    </YStack>
  );
}

/** react-hook-form bound text input with label, hint and validation message */
export function TextField<T extends FieldValues>({ control, name, label, hint, secureTextEntry, ...input }: Readonly<TextFieldProps<T>>) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <YStack gap={6}>
          {label ? <FieldLabel>{label}</FieldLabel> : null}
          <XStack alignItems="center">
            <Input
              flex={1}
              value={field.value == null ? '' : String(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              backgroundColor={C.white}
              borderWidth={1}
              borderColor={fieldState.error ? C.red : C.line}
              focusStyle={{ borderColor: C.green }}
              borderRadius={16}
              height={52}
              paddingHorizontal={16}
              paddingRight={secureTextEntry ? 48 : 16}
              fontSize={15}
              color={C.ink}
              placeholderTextColor={C.faint as never}
              secureTextEntry={hidden}
              aria-label={label}
              {...input}
            />
            {secureTextEntry ? <RevealToggle hidden={hidden} onToggle={() => setHidden((h) => !h)} /> : null}
          </XStack>
          <FieldHelp error={fieldState.error?.message} hint={hint} />
        </YStack>
      )}
    />
  );
}
