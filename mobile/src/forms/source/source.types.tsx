import { z } from 'zod';
import type { PaymentSourceInput } from '@/gql/graphql';
import type { PaymentSource } from '@/lib/types';
import { zName } from '../validators';

export const sourceSchema = z.object({
  name: zName,
  icon: z.string().min(1, 'Pick an icon'),
});

export type SourceValues = z.infer<typeof sourceSchema>;

export const sourceDefaults = (source: PaymentSource | null): SourceValues => ({ name: source?.name ?? '', icon: source?.icon ?? 'card' });

export const toSourceInput = (v: SourceValues, isDefault?: boolean): PaymentSourceInput => ({ name: v.name.trim(), icon: v.icon, isDefault });
