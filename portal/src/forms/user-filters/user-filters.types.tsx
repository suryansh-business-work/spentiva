import { z } from 'zod';
import type { RulesFieldsFragment, UserFilter, UserRole } from '@/gql/graphql';
import { ROLE_LABELS, optionsOf } from '@/lib/labels';
import { oneOf, text } from '@/lib/params';

const ROLES = Object.keys(ROLE_LABELS) as [UserRole, ...UserRole[]];
const STATES = ['active', 'disabled'] as const;

export const ROLE_OPTIONS = optionsOf(ROLE_LABELS);
export const STATE_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

export const userFiltersSchema = (rules: Pick<RulesFieldsFragment, 'searchMax'>) =>
  z.object({
    search: z.string().max(rules.searchMax, `Use at most ${rules.searchMax} characters`),
    role: z.enum(ROLES).or(z.literal('')),
    state: z.enum(STATES).or(z.literal('')),
  });

export type UserFiltersValues = z.infer<ReturnType<typeof userFiltersSchema>>;

export const userFiltersFromParams = (p: URLSearchParams): UserFiltersValues => ({
  search: text(p, 'q'),
  role: oneOf(p, 'role', ROLES),
  state: oneOf(p, 'state', STATES),
});

export const userFiltersToParams = (v: UserFiltersValues) => ({ q: v.search.trim() || null, role: v.role || null, state: v.state || null });

export function toUserFilter(p: URLSearchParams): UserFilter {
  const v = userFiltersFromParams(p);
  return { search: v.search.trim() || null, role: v.role || null, disabled: v.state ? v.state === 'disabled' : null };
}
