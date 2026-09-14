import { YStack } from 'tamagui';
import { Btn, ErrorState, H2, Muted } from './ui';
import { C } from '@/theme/colors';

interface StartupErrorProps {
  error: unknown;
  onRetry: () => void;
  onSignOut: () => void;
}

/** Shown when the signed-in app can't load the user's trackers (e.g. offline right after login) */
export function StartupError({ error, onRetry, onSignOut }: Readonly<StartupErrorProps>) {
  return (
    <YStack flex={1} backgroundColor={C.bg} justifyContent="center" padding={24} gap={14}>
      <H2 textAlign="center">Couldn’t load your trackers</H2>
      <Muted textAlign="center">Check your connection and try again.</Muted>
      <ErrorState error={error} onRetry={onRetry} />
      <Btn title="Log out" variant="ghost" onPress={onSignOut} />
    </YStack>
  );
}
