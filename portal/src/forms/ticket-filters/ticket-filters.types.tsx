import { z } from 'zod';
import type { RulesFieldsFragment, TicketCategory, TicketFilter, TicketPriority, TicketStatus } from '@/gql/graphql';
import { CATEGORY_LABELS, PRIORITY_LABELS, TICKET_STATUS_LABELS, optionsOf } from '@/lib/labels';
import { oneOf, text } from '@/lib/params';

const STATUSES = Object.keys(TICKET_STATUS_LABELS) as [TicketStatus, ...TicketStatus[]];
const PRIORITIES = Object.keys(PRIORITY_LABELS) as [TicketPriority, ...TicketPriority[]];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as [TicketCategory, ...TicketCategory[]];

export const STATUS_OPTIONS = optionsOf(TICKET_STATUS_LABELS);
export const PRIORITY_OPTIONS = optionsOf(PRIORITY_LABELS);
export const CATEGORY_OPTIONS = optionsOf(CATEGORY_LABELS);

export const ticketFiltersSchema = (rules: Pick<RulesFieldsFragment, 'searchMax'>) =>
  z.object({
    search: z.string().max(rules.searchMax, `Use at most ${rules.searchMax} characters`),
    status: z.enum(STATUSES).or(z.literal('')),
    priority: z.enum(PRIORITIES).or(z.literal('')),
    category: z.enum(CATEGORIES).or(z.literal('')),
  });

export type TicketFiltersValues = z.infer<ReturnType<typeof ticketFiltersSchema>>;

export const ticketFiltersFromParams = (p: URLSearchParams): TicketFiltersValues => ({
  search: text(p, 'q'),
  status: oneOf(p, 'status', STATUSES),
  priority: oneOf(p, 'priority', PRIORITIES),
  category: oneOf(p, 'category', CATEGORIES),
});

export const ticketFiltersToParams = (v: TicketFiltersValues) => ({
  q: v.search.trim() || null,
  status: v.status || null,
  priority: v.priority || null,
  category: v.category || null,
});

export function toTicketFilter(p: URLSearchParams): TicketFilter {
  const v = ticketFiltersFromParams(p);
  return {
    search: v.search.trim() || null,
    status: v.status || null,
    priority: v.priority || null,
    category: v.category || null,
    userId: p.get('userId'),
  };
}
