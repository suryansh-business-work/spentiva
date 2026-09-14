import type { z } from 'zod';
import type { PageZ } from '../graphql/inputs.js';
import { badInput } from './errors.js';

export interface Paging {
  skip: number;
  limit: number;
  sort: Record<string, 1 | -1>;
}

/** Page / size / sort for the portal tables; only whitelisted fields can be sorted */
export function paging(input: z.infer<typeof PageZ>, sortable: readonly string[], defaultSort: string): Paging {
  const limit = input.pageSize ?? 25;
  const field = input.sortBy ?? defaultSort;
  if (!sortable.includes(field)) throw badInput(`Can't sort by ${field}`);
  const dir = input.sortDir === 'ASC' ? 1 : -1;
  return { skip: (input.page ?? 0) * limit, limit, sort: { [field]: dir, _id: dir } };
}
