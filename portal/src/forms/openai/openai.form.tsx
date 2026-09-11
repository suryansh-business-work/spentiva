import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormSelect, FormTextField } from '@/components/form';
import { useNotify } from '@/components/Notify';
import { ErrorAlert } from '@/components/states';
import type { EnvFieldsFragment } from '@/gql/graphql';
import { useSaveEnvVars, useTestOpenAi } from '@/hooks/mutations';
import { useOpenAiModels } from '@/hooks/queries';
import { openAiDefaults, openAiSchema, toOpenAiEnv, type OpenAiValues } from './openai.types';

interface OpenAiFormProps {
  apiKey?: EnvFieldsFragment;
  model?: EnvFieldsFragment;
}

/** OpenAI key + model used to parse chat messages (stored encrypted on the server) */
export function OpenAiForm({ apiKey, model }: Readonly<OpenAiFormProps>) {
  const notify = useNotify();
  const save = useSaveEnvVars();
  const test = useTestOpenAi();
  const hasKey = Boolean(apiKey?.isSet);
  const models = useOpenAiModels(hasKey);
  const schema = useMemo(() => openAiSchema(hasKey), [hasKey]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<OpenAiValues>({ resolver: zodResolver(schema), values: openAiDefaults(model?.value ?? null), mode: 'onChange' });

  // The saved model stays selectable even before (or without) the model list from OpenAI
  const saved = model?.value;
  const names = new Set([...(saved ? [saved] : []), ...(models.data?.openAiModels ?? [])]);
  const options = [...names].map((m) => ({ value: m, label: m }));

  const submit = handleSubmit(async (v) => {
    await save.mutateAsync({ input: toOpenAiEnv(v) });
    reset(openAiDefaults(v.model));
    notify.success('OpenAI settings saved');
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit}>
      <FormTextField
        control={control}
        name="apiKey"
        label="API key"
        type="password"
        autoComplete="off"
        placeholder={hasKey ? `Saved (${apiKey?.value ?? ''}) — type a new key to replace it` : 'sk-…'}
        hint={hasKey ? 'Leave empty to keep the saved key' : 'Required for the chat to understand messages'}
      />
      <FormSelect control={control} name="model" label="Model" options={options} hint="gpt-4o is recommended for parsing" />
      <ErrorAlert error={save.error ?? models.error} />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          Save OpenAI settings
        </Button>
        <Button variant="outlined" onClick={() => test.mutate({})} loading={test.isPending} disabled={!hasKey}>
          Test connection
        </Button>
      </Stack>
      {test.data ? <Alert severity="success">Connected — {test.data.testOpenAi}</Alert> : <ErrorAlert error={test.error} />}
    </Stack>
  );
}
