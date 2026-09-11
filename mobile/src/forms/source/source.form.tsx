import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { XStack, YStack } from 'tamagui';
import { FieldLabel, TextField } from '@/components/form';
import { Icon } from '@/components/Icon';
import { SOURCE_ICON_KEYS, iconFor } from '@/components/icons';
import { Btn, ErrorText, H2 } from '@/components/ui';
import { useCreateSource, useUpdateSource } from '@/hooks/mutations';
import { runAsync } from '@/lib/log';
import type { PaymentSource } from '@/lib/types';
import { C, tint } from '@/theme/colors';
import { sourceDefaults, sourceSchema, toSourceInput, type SourceValues } from './source.types';

function IconOption({ iconKey, selected, onPress }: Readonly<{ iconKey: string; selected: boolean; onPress: () => void }>) {
  return (
    <YStack
      width={44}
      height={44}
      borderRadius={14}
      alignItems="center"
      justifyContent="center"
      backgroundColor={selected ? tint(C.green, 0.16) : C.bg}
      borderWidth={selected ? 1.5 : 0}
      borderColor={C.green}
      onPress={onPress}
      role="radio"
      aria-checked={selected}
      aria-label={iconKey}
    >
      <Icon as={iconFor(iconKey)} size={20} color={selected ? C.green : C.sub} />
    </YStack>
  );
}

/** Create or rename a payment mode ("Expense From") and pick its icon */
export function SourceForm({ source, onDone }: Readonly<{ source: PaymentSource | null; onDone: () => void }>) {
  const create = useCreateSource();
  const update = useUpdateSource();
  const { control, handleSubmit } = useForm<SourceValues>({ resolver: zodResolver(sourceSchema), values: sourceDefaults(source) });

  const submit = runAsync(
    'source',
    handleSubmit(async (v) => {
      if (source) await update.mutateAsync({ id: source.id, input: toSourceInput(v) });
      else await create.mutateAsync({ input: toSourceInput(v) });
      onDone();
    }),
  );

  return (
    <YStack gap={14}>
      <H2>{source ? 'Edit payment mode' : 'New payment mode'}</H2>
      <TextField control={control} name="name" label="Name" placeholder="e.g. HDFC Credit Card" autoCapitalize="words" />
      <FieldLabel>Icon</FieldLabel>
      <Controller
        control={control}
        name="icon"
        render={({ field }) => (
          <XStack gap={10} flexWrap="wrap" role="radiogroup">
            {SOURCE_ICON_KEYS.map((key) => (
              <IconOption key={key} iconKey={key} selected={field.value === key} onPress={() => field.onChange(key)} />
            ))}
          </XStack>
        )}
      />
      <ErrorText error={create.error ?? update.error} />
      <Btn title={source ? 'Save' : 'Add'} onPress={submit} loading={create.isPending || update.isPending} />
    </YStack>
  );
}
