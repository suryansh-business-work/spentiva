import { FiSend } from 'react-icons/fi';
import { Input, XStack, YStack } from 'tamagui';
import { Icon } from '@/components/Icon';
import { C } from '@/theme/colors';

interface ComposerProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
}

/** Message input + send button */
export function Composer({ value, onChange, onSend }: Readonly<ComposerProps>) {
  const ready = value.trim().length > 0;
  return (
    <XStack
      paddingHorizontal={12}
      paddingVertical={10}
      gap={10}
      alignItems="flex-end"
      backgroundColor={C.white}
      borderTopWidth={1}
      borderColor={C.line}
    >
      <Input
        flex={1}
        value={value}
        onChangeText={onChange}
        placeholder="e.g. spent 250 on lunch via UPI"
        placeholderTextColor={C.faint as never}
        backgroundColor={C.bg}
        borderWidth={0}
        borderRadius={24}
        minHeight={48}
        maxHeight={120}
        paddingHorizontal={18}
        fontSize={15}
        color={C.ink}
        multiline
        maxLength={500}
        onSubmitEditing={onSend}
        submitBehavior="submit"
        returnKeyType="send"
        aria-label="Message"
      />
      <YStack
        width={48}
        height={48}
        borderRadius={24}
        alignItems="center"
        justifyContent="center"
        backgroundColor={ready ? C.green : C.pill}
        pressStyle={{ scale: 0.92 }}
        transition="quick"
        onPress={onSend}
        role="button"
        aria-label="Send"
        aria-disabled={!ready}
      >
        <Icon as={FiSend} size={20} color={ready ? C.white : C.faint} />
      </YStack>
    </XStack>
  );
}
