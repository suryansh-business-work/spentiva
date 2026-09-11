import { Text } from 'tamagui';
import { C } from '@/theme/colors';

export function FieldLabel({ children }: Readonly<{ children: string }>) {
  return (
    <Text fontSize={13} fontWeight="600" color={C.sub}>
      {children}
    </Text>
  );
}

/** Validation error, or the hint when there is none */
export function FieldHelp({ error, hint }: Readonly<{ error?: string; hint?: string }>) {
  if (error) {
    return (
      <Text fontSize={12} color={C.red} role="alert">
        {error}
      </Text>
    );
  }
  if (hint) {
    return (
      <Text fontSize={12} color={C.faint}>
        {hint}
      </Text>
    );
  }
  return null;
}
