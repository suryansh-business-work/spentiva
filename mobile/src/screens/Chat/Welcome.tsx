import { ScrollView } from 'react-native';
import { Text, XStack } from 'tamagui';
import { Logo } from '@/components/Logo';
import { Muted } from '@/components/ui';
import { useReference } from '@/hooks/queries';
import { C } from '@/theme/colors';

function Suggestion({ text, onPick }: Readonly<{ text: string; onPick: (t: string) => void }>) {
  return (
    <XStack
      paddingHorizontal={14}
      paddingVertical={10}
      borderRadius={999}
      backgroundColor={C.white}
      borderWidth={1}
      borderColor={C.line}
      pressStyle={{ opacity: 0.6 }}
      onPress={() => onPick(text)}
      role="button"
      aria-label={text}
    >
      <Text fontSize={13} fontWeight="600" color={C.ink}>
        {text}
      </Text>
    </XStack>
  );
}

/** Empty chat: what the assistant can do + starter prompts (served by the API) */
export function Welcome({ name, onPick }: Readonly<{ name: string; onPick: (text: string) => void }>) {
  const { data } = useReference();
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <Logo size={40} showName={false} />
      <Text fontSize={24} fontWeight="800" color={C.ink} letterSpacing={-0.5}>
        Hi {name}! Tell me what you spent.
      </Text>
      <Muted>
        I log expenses and income from plain messages, and I can chart your spending by category, day, month, average or top spends. If I&apos;m not
        sure about a category or payment mode, I&apos;ll ask with options.
      </Muted>
      <XStack flexWrap="wrap" gap={8} marginTop={6}>
        {(data?.chatSuggestions ?? []).map((s) => (
          <Suggestion key={s} text={s} onPick={onPick} />
        ))}
      </XStack>
    </ScrollView>
  );
}
