import { z } from 'zod';
import type { RulesFieldsFragment, TicketStatus } from '@/gql/graphql';
import { TICKET_STATUS_LABELS, optionsOf } from '@/lib/labels';

const STATUSES = Object.keys(TICKET_STATUS_LABELS) as [TicketStatus, ...TicketStatus[]];
export const STATUS_OPTIONS = optionsOf(TICKET_STATUS_LABELS);

/** Reply length limit from the API; status is optional ('' = let the API decide) */
export const ticketReplySchema = (rules: Pick<RulesFieldsFragment, 'ticketMessageMax'>) =>
  z.object({
    body: z.string().trim().min(1, 'Write a reply').max(rules.ticketMessageMax, `Use at most ${rules.ticketMessageMax} characters`),
    status: z.enum(STATUSES).or(z.literal('')),
  });

export type TicketReplyValues = z.infer<ReturnType<typeof ticketReplySchema>>;

export const ticketReplyDefaults: TicketReplyValues = { body: '', status: '' };

/** What happens to the status when none is picked (mirrors the API) */
export const autoStatusHint = (current: TicketStatus) =>
  current === 'OPEN' ? 'Leave empty to move it to In progress' : `Leave empty to keep it ${TICKET_STATUS_LABELS[current].toLowerCase()}`;
