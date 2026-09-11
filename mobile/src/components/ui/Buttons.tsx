import { ActivityIndicator } from 'react-native';
import type { IconType } from 'react-icons';
import { Text, XStack, YStack } from 'tamagui';
import { C } from '@/theme/colors';
import { Icon } from '../Icon';

interface IconButtonProps {
  icon: IconType;
  onPress?: () => void;
  size?: number;
  plain?: boolean;
  color?: string;
  bg?: string;
  label: string;
}

export function IconButton({ icon, onPress, size = 44, plain, color = C.ink, bg = C.white, label }: Readonly<IconButtonProps>) {
  return (
    <YStack
      width={size}
      height={size}
      borderRadius={size / 2}
      alignItems="center"
      justifyContent="center"
      backgroundColor={plain ? 'transparent' : bg}
      borderWidth={plain ? 0 : 1}
      borderColor={C.line}
      pressStyle={{ opacity: 0.6, scale: 0.94 }}
      transition="quick"
      onPress={onPress}
      aria-label={label}
      role="button"
    >
      <Icon as={icon} size={size * 0.45} color={color} />
    </YStack>
  );
}

export type ButtonVariant = 'dark' | 'green' | 'lime' | 'ghost' | 'danger';
const VARIANTS: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  dark: { bg: C.ink, fg: C.white, border: C.ink },
  green: { bg: C.green, fg: C.white, border: C.green },
  lime: { bg: C.limeStrong, fg: C.ink, border: C.limeStrong },
  ghost: { bg: C.white, fg: C.ink, border: C.line },
  danger: { bg: C.redSoft, fg: C.red, border: C.redSoft },
};

interface BtnProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconType;
  variant?: ButtonVariant;
  flex?: number;
  height?: number;
}

function BtnAdornment({ loading, icon, color }: Readonly<{ loading?: boolean; icon?: IconType; color: string }>) {
  if (loading) return <ActivityIndicator color={color} />;
  if (icon) return <Icon as={icon} size={18} color={color} />;
  return null;
}

export function Btn({ title, onPress, loading, disabled, icon, variant = 'dark', flex, height = 52 }: Readonly<BtnProps>) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <XStack
      flex={flex}
      height={height}
      borderRadius={18}
      alignItems="center"
      justifyContent="center"
      gap={8}
      paddingHorizontal={18}
      backgroundColor={v.bg}
      borderWidth={1}
      borderColor={v.border}
      opacity={inactive ? 0.55 : 1}
      pressStyle={{ opacity: 0.85, scale: 0.98 }}
      transition="quick"
      onPress={inactive ? undefined : onPress}
      role="button"
      aria-label={title}
      aria-disabled={inactive}
    >
      <BtnAdornment loading={loading} icon={icon} color={v.fg} />
      <Text color={v.fg} fontSize={15} fontWeight="700">
        {title}
      </Text>
    </XStack>
  );
}

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconType;
  color?: string;
  disabled?: boolean;
}

export function Chip({ label, selected, onPress, icon, color = C.ink, disabled }: Readonly<ChipProps>) {
  const background = selected ? color : C.white;
  const foreground = selected ? C.white : C.ink;
  return (
    <XStack
      alignItems="center"
      gap={6}
      paddingHorizontal={14}
      paddingVertical={9}
      borderRadius={999}
      backgroundColor={background}
      borderWidth={1}
      borderColor={selected ? color : C.line}
      opacity={disabled ? 0.45 : 1}
      pressStyle={{ opacity: 0.7 }}
      onPress={disabled ? undefined : onPress}
      role="button"
      aria-label={label}
    >
      {icon ? <Icon as={icon} size={14} color={selected ? C.white : color} /> : null}
      <Text fontSize={13} fontWeight="600" color={foreground}>
        {label}
      </Text>
    </XStack>
  );
}

interface SegmentedProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}

/** Two-or-more option toggle, e.g. Expense / Income */
export function Segmented<T extends string>({ value, options, onChange }: Readonly<SegmentedProps<T>>) {
  return (
    <XStack backgroundColor={C.pill} borderRadius={16} padding={4} gap={4} role="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <YStack
            key={o.value}
            flex={1}
            paddingVertical={10}
            borderRadius={12}
            alignItems="center"
            backgroundColor={on ? C.white : 'transparent'}
            onPress={() => onChange(o.value)}
            pressStyle={{ opacity: 0.8 }}
            role="tab"
            aria-selected={on}
          >
            <Text fontSize={14} fontWeight={on ? '700' : '500'} color={on ? C.ink : C.sub}>
              {o.label}
            </Text>
          </YStack>
        );
      })}
    </XStack>
  );
}
