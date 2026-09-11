import { z } from 'zod';
import { zName } from '../validators';

export const categorySchema = z.object({ name: zName });

export type CategoryValues = z.infer<typeof categorySchema>;

export const categoryDefaults = (name = ''): CategoryValues => ({ name });
