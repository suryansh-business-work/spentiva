import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { XStack, YStack } from 'tamagui';
import { SelectField, TextField } from '@/components/form';
import { Btn, ErrorText, Success } from '@/components/ui';
import { useSaveEnvVars, useTestOpenAi } from '@/hooks/mutations';
import { useOpenAiModels } from '@/hooks/queries';
import { runAsync } from '@/lib/log';
import type { EnvVar } from '@/lib/types';
import { openAiDefaults, openAiSchema, toOpenAiEnv, type OpenAiValues } from './openai.types';

interface OpenAiFormProps {
  apiKey?: EnvVar;
  model?: EnvVar;
}

/** OpenAI API key + model (admin, stored encrypted on the server) */
export function OpenAiForm({ apiKey, model }: Readonly<OpenAiFormProps>) {
  const save = useSaveEnvVars();
  const test = useTestOpenAi();
  const models = useOpenAiModels(true);
  const { control, handleSubmit, reset } = useForm<OpenAiValues>({
    resolver: zodResolver(openAiSchema),
    values: openAiDefaults(model?.value ?? null),
  });

  const submit = runAsync(
    'openai',
    handleSubmit(async (v) => {
      await save.mutateAsync({ input: toOpenAiEnv(v) });
      reset(openAiDefaults(v.model));
    }),
  );
  const runTest = runAsync('openai', () => test.mutateAsync({}));
  const removeKey = runAsync('openai', () => save.mutateAsync({ input: [{ key: 'OPENAI_API_KEY', value: null }] }));

  const items = (models.data ?? [model?.value ?? 'gpt-4o']).map((m) => ({ value: m, label: m }));

  return (
    <YStack gap={12}>
      <TextField
        control={control}
        name="apiKey"
        label="API key"
        placeholder={apiKey?.isSet ? 'Enter a new key to replace' : 'sk-…'}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        hint="Leave empty to keep the current key"
      />
      <Controller
        control={control}
        name="model"
        render={({ field, fieldState }) => (
          <SelectField
            label="Model"
            title="OpenAI model"
            value={field.value}
            placeholder="gpt-4o"
            items={items}
            onChange={field.onChange}
            error={fieldState.error?.message}
            hint="gpt-4o is recommended for parsing"
            searchable
          />
        )}
      />
      <ErrorText error={save.error ?? models.error} />
      <Btn title="Save OpenAI settings" onPress={submit} loading={save.isPending} height={48} />
      <XStack gap={10}>
        <Btn title="Test OpenAI" variant="ghost" flex={1} height={46} onPress={runTest} loading={test.isPending} />
        {apiKey?.source === 'APP' ? <Btn title="Remove key" variant="danger" flex={1} height={46} onPress={removeKey} /> : null}
      </XStack>
      {test.data ? <Success>Connected — {test.data.testOpenAi}</Success> : <ErrorText error={test.error} />}
    </YStack>
  );
}
