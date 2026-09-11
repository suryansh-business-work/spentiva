import type { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import type { IconType } from 'react-icons';
import { FiAlertCircle, FiInbox } from 'react-icons/fi';
import { Text, YStack } from 'tamagui';
import { errorMessage } from '@/lib/api';
import { C } from '@/theme/colors';
import { Icon } from '../Icon';
import { Btn } from './Buttons';
import { Card } from './Layout';
import { IconBadge } from './Rows';
import { Body, H3, Muted } from './Typography';

export function Loading({ label }: Readonly<{ label?: string }>) {
  return (
    <YStack flex={1} minHeight={160} alignItems="center" justifyContent="center" gap={10}>
      <ActivityIndicator color={C.green} size="large" />
      {label ? <Muted>{label}</Muted> : null}
    </YStack>
  );
}

export function ErrorState({ error, onRetry }: Readonly<{ error: unknown; onRetry?: () => void }>) {
  return (
    <Card alignItems="center" paddingVertical={24}>
      <Icon as={FiAlertCircle} size={28} color={C.red} />
      <Body textAlign="center">{errorMessage(error)}</Body>
      {onRetry ? <Btn title="Try again" variant="ghost" onPress={onRetry} height={44} /> : null}
    </Card>
  );
}

/** Inline error line for forms and mutations */
export function ErrorText({ error }: Readonly<{ error: unknown }>) {
  if (!error) return null;
  return (
    <Text color={C.red} fontSize={13} role="alert">
      {errorMessage(error)}
    </Text>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IconType;
  action?: ReactNode;
}

export function EmptyState({ title, message, icon = FiInbox, action }: Readonly<EmptyStateProps>) {
  return (
    <YStack alignItems="center" paddingVertical={28} gap={8}>
      <IconBadge icon={icon} size={56} />
      <H3 marginTop={6}>{title}</H3>
      {message ? (
        <Muted textAlign="center" maxWidth={280}>
          {message}
        </Muted>
      ) : null}
      {action}
    </YStack>
  );
}
