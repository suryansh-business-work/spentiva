import { z } from 'zod';

export const openAiSchema = z.object({
  apiKey: z
    .string()
    .trim()
    .refine((v) => v === '' || /^sk-[\w-]{20,}$/.test(v), 'OpenAI keys look like sk-…'),
  model: z.string().trim().min(1, 'Pick a model'),
});

export type OpenAiValues = z.infer<typeof openAiSchema>;

export const openAiDefaults = (model: string | null): OpenAiValues => ({ apiKey: '', model: model ?? 'gpt-4o' });

/** Only send the key when a new one was typed */
export const toOpenAiEnv = (v: OpenAiValues) => [
  { key: 'OPENAI_MODEL', value: v.model },
  ...(v.apiKey ? [{ key: 'OPENAI_API_KEY', value: v.apiKey }] : []),
];
