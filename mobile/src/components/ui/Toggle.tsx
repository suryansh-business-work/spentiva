import { Text, XStack, YStack } from 'tamagui';
import { C } from '@/theme/colors';

interface ToggleProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

/** A labelled on/off switch row */
export function Toggle({ label, hint, value, onChange, disabled }: Readonly<ToggleProps>) {
  return (
    <XStack
      alignItems="center"
      gap={12}
      paddingVertical={10}
      opacity={disabled ? 0.55 : 1}
      onPress={disabled ? undefined : () => onChange(!value)}
      pressStyle={{ opacity: 0.7 }}
      role="switch"
      aria-checked={value}
      aria-label={label}
    >
      <YStack flex={1} gap={2}>
        <Text fontSize={15} fontWeight="600" color={C.ink}>
          {label}
        </Text>
        {hint ? (
          <Text fontSize={12} color={C.sub}>
            {hint}
          </Text>
        ) : null}
      </YStack>
      <XStack
        width={50}
        height={30}
        borderRadius={15}
        padding={3}
        backgroundColor={value ? C.green : C.track}
        justifyContent={value ? 'flex-end' : 'flex-start'}
      >
        <YStack width={24} height={24} borderRadius={12} backgroundColor={C.white} />
      </XStack>
    </XStack>
  );
}
