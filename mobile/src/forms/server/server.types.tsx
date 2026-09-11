import { z } from 'zod';

export const serverSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Server URL is required')
    .pipe(z.url('Enter a full URL, e.g. https://api.example.com/graphql'))
    .refine((v) => v.endsWith('/graphql'), 'The URL should end with /graphql'),
});

export type ServerValues = z.infer<typeof serverSchema>;
