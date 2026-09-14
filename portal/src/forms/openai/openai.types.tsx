import { z } from 'zod';
import type { EnvVarInput } from '@/gql/graphql';

/** The key is only required while none is saved yet; an empty field keeps the saved key */
export const openAiSchema = (hasKey: boolean) =>
  z.object({
    apiKey: z
      .string()
      .trim()
      .refine((v) => hasKey || v !== '', 'Paste an OpenAI API key')
      .refine((v) => v === '' || /^sk-[\w-]{20,}$/.test(v), 'OpenAI keys look like sk-…'),
    model: z.string().trim().min(1, 'Pick a model'),
  });

export type OpenAiValues = z.infer<ReturnType<typeof openAiSchema>>;

export const openAiDefaults = (model: string | null): OpenAiValues => ({ apiKey: '', model: model ?? '' });

/** Only send the key when a new one was typed */
export const toOpenAiEnv = (v: OpenAiValues): EnvVarInput[] => [
  { key: 'OPENAI_MODEL', value: v.model },
  ...(v.apiKey ? [{ key: 'OPENAI_API_KEY', value: v.apiKey }] : []),
];
