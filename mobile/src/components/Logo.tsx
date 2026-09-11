import { FiPieChart } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { C } from '@/theme/colors';
import { Icon } from './Icon';

export function Logo({ size = 44, showName = true }: Readonly<{ size?: number; showName?: boolean }>) {
  return (
    <XStack alignItems="center" gap={10}>
      <YStack width={size} height={size} borderRadius={size / 3} backgroundColor={C.ink} alignItems="center" justifyContent="center">
        <Icon as={FiPieChart} size={size * 0.5} color={C.limeStrong} strokeWidth={2.4} />
      </YStack>
      {showName ? (
        <Text fontSize={size * 0.55} fontWeight="800" color={C.ink} letterSpacing={-0.8}>
          Spentiva
        </Text>
      ) : null}
    </XStack>
  );
}
