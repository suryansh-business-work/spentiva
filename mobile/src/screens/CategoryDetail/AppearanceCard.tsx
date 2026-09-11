import { FiCheck } from 'react-icons/fi';
import { XStack, YStack } from 'tamagui';
import { FieldLabel } from '@/components/form';
import { Icon } from '@/components/Icon';
import { CATEGORY_ICON_KEYS, iconFor } from '@/components/icons';
import { Card } from '@/components/ui';
import { CATEGORY_COLORS } from '@/lib/constants';
import type { Category } from '@/lib/types';
import { C, tint } from '@/theme/colors';

interface AppearanceCardProps {
  category: Category;
  onChange: (input: { color?: string; icon?: string }) => void;
}

function Swatch({ color, selected, onPress }: Readonly<{ color: string; selected: boolean; onPress: () => void }>) {
  return (
    <YStack
      width={34}
      height={34}
      borderRadius={17}
      backgroundColor={color}
      alignItems="center"
      justifyContent="center"
      borderWidth={selected ? 3 : 0}
      borderColor={tint(C.ink, 0.25)}
      pressStyle={{ scale: 0.9 }}
      onPress={onPress}
      role="radio"
      aria-checked={selected}
      aria-label={color}
    >
      {selected ? <Icon as={FiCheck} size={16} color={C.white} /> : null}
    </YStack>
  );
}

function IconChoice({ iconKey, color, selected, onPress }: Readonly<{ iconKey: string; color: string; selected: boolean; onPress: () => void }>) {
  return (
    <YStack
      width={44}
      height={44}
      borderRadius={14}
      alignItems="center"
      justifyContent="center"
      backgroundColor={selected ? tint(color, 0.18) : C.bg}
      borderWidth={selected ? 1.5 : 0}
      borderColor={color}
      pressStyle={{ scale: 0.92 }}
      onPress={onPress}
      role="radio"
      aria-checked={selected}
      aria-label={iconKey}
    >
      <Icon as={iconFor(iconKey)} size={20} color={selected ? color : C.sub} />
    </YStack>
  );
}

/** Colour + icon pickers (saved immediately) */
export function AppearanceCard({ category, onChange }: Readonly<AppearanceCardProps>) {
  return (
    <Card>
      <FieldLabel>Colour</FieldLabel>
      <XStack flexWrap="wrap" gap={10} role="radiogroup">
        {CATEGORY_COLORS.map((color) => (
          <Swatch key={color} color={color} selected={category.color === color} onPress={() => onChange({ color })} />
        ))}
      </XStack>
      <FieldLabel>Icon</FieldLabel>
      <XStack flexWrap="wrap" gap={10} role="radiogroup">
        {CATEGORY_ICON_KEYS.map((key) => (
          <IconChoice key={key} iconKey={key} color={category.color} selected={category.icon === key} onPress={() => onChange({ icon: key })} />
        ))}
      </XStack>
    </Card>
  );
}
