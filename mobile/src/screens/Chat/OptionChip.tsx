import { FiCheck, FiRotateCcw } from 'react-icons/fi';
import { Text, XStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import type { ChatMessage, ChatOption } from '@/lib/types';
import { C, tint } from '@/theme/colors';

interface OptionChipProps {
  option: ChatOption;
  message: ChatMessage;
  disabled: boolean;
  onPress: () => void;
}

type ChipState = 'chosen' | 'dimmed' | 'suggestion' | 'open';

function stateOf(option: ChatOption, message: ChatMessage): ChipState {
  if (option.action === 'PROMPT') return 'suggestion';
  if (message.selectedOptionId === option.id) return 'chosen';
  if (message.resolved) return 'dimmed';
  return 'open';
}

const STYLE: Record<ChipState, { bg: string; border: string; fg: string; opacity: number }> = {
  chosen: { bg: C.green, border: C.green, fg: C.white, opacity: 1 },
  dimmed: { bg: C.limeSoft, border: tint(C.green, 0.35), fg: C.ink, opacity: 0.4 },
  suggestion: { bg: C.white, border: C.line, fg: C.ink, opacity: 1 },
  open: { bg: C.limeSoft, border: tint(C.green, 0.35), fg: C.ink, opacity: 1 },
};

function ChipIcon({ state, undo }: Readonly<{ state: ChipState; undo: boolean }>) {
  if (state === 'chosen') return <Icon as={FiCheck} size={14} color={C.white} />;
  if (undo) return <Icon as={FiRotateCcw} size={13} color={C.ink} />;
  return null;
}

/** Answer chip under an assistant message (category / payment mode choices, Undo, suggestions) */
export function OptionChip({ option, message, disabled, onPress }: Readonly<OptionChipProps>) {
  const state = stateOf(option, message);
  const style = STYLE[state];
  const undo = option.action === 'UNDO';
  const interactive = !disabled && (state === 'open' || state === 'suggestion');
  const label = undo && state === 'chosen' ? 'Undone' : option.label;
  return (
    <XStack
      alignItems="center"
      gap={6}
      paddingHorizontal={14}
      paddingVertical={9}
      borderRadius={999}
      borderWidth={1}
      borderColor={style.border}
      backgroundColor={style.bg}
      opacity={style.opacity}
      pressStyle={{ opacity: 0.6 }}
      onPress={interactive ? onPress : undefined}
      role="button"
      aria-label={label}
      aria-disabled={!interactive}
    >
      <ChipIcon state={state} undo={undo} />
      <Text fontSize={13} fontWeight="600" color={style.fg}>
        {label}
      </Text>
    </XStack>
  );
}
