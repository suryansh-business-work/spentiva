import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { FiChevronRight } from 'react-icons/fi';
import { Text, XStack, YStack, type XStackProps } from 'tamagui';
import { C, tint } from '@/theme/colors';
import { Icon } from '../Icon';
import { H2 } from './Typography';

interface IconBadgeProps {
  icon: IconType;
  color?: string;
  size?: number;
}

export function IconBadge({ icon, color = C.green, size = 42 }: Readonly<IconBadgeProps>) {
  return (
    <YStack width={size} height={size} borderRadius={size / 2.6} alignItems="center" justifyContent="center" backgroundColor={tint(color, 0.14)}>
      <Icon as={icon} size={size * 0.46} color={color} />
    </YStack>
  );
}

interface ListRowProps {
  icon?: IconType;
  iconColor?: string;
  title: string;
  subtitle?: string | null;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
}

export function ListRow({ icon, iconColor, title, subtitle, right, onPress, chevron = !!onPress }: Readonly<ListRowProps>) {
  return (
    <XStack alignItems="center" gap={12} paddingVertical={10} pressStyle={onPress ? { opacity: 0.6 } : undefined} onPress={onPress} role="button">
      {icon ? <IconBadge icon={icon} color={iconColor} size={38} /> : null}
      <YStack flex={1} gap={2}>
        <Text fontSize={15} fontWeight="600" color={C.ink} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text fontSize={12} color={C.sub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </YStack>
      {right}
      {chevron ? <Icon as={FiChevronRight} size={18} color={C.faint} /> : null}
    </XStack>
  );
}

export const Divider = () => <YStack height={1} backgroundColor={C.line} />;

export function Pill({ children, ...props }: Readonly<XStackProps & { children: ReactNode }>) {
  return (
    <XStack
      alignItems="center"
      gap={8}
      paddingHorizontal={16}
      height={44}
      borderRadius={22}
      backgroundColor={C.pill}
      pressStyle={{ opacity: 0.7 }}
      {...props}
    >
      {children}
    </XStack>
  );
}

interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, action, onAction }: Readonly<SectionTitleProps>) {
  return (
    <XStack alignItems="center" justifyContent="space-between" marginTop={4}>
      <H2>{title}</H2>
      {action ? (
        <Text fontSize={13} fontWeight="700" color={C.green} onPress={onAction} role="button">
          {action}
        </Text>
      ) : null}
    </XStack>
  );
}

/** Horizontal fill bar (0–100) */
export function ProgressBar({ percent, color, height = 8 }: Readonly<{ percent: number; color: string; height?: number }>) {
  const width = `${Math.max(2, Math.min(100, percent))}%` as const;
  return (
    <YStack height={height} borderRadius={height / 2} backgroundColor={C.track} overflow="hidden">
      <YStack height={height} borderRadius={height / 2} backgroundColor={color} width={width} />
    </YStack>
  );
}
