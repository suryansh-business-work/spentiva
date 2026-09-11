import type { DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { TICKET_CATEGORY_OPTIONS } from '@/lib/constants';
import type { TicketCategory, ValidationRules } from '@/lib/types';

const CATEGORIES = TICKET_CATEGORY_OPTIONS.map((o) => o.value) as [TicketCategory, ...TicketCategory[]];

/** Limits come from the API (validationRules), so the app checks exactly what the server checks */
export const ticketSchema = (rules: ValidationRules) =>
  z.object({
    category: z.enum(CATEGORIES, 'Pick what this is about'),
    subject: z
      .string()
      .trim()
      .min(rules.ticketSubjectMin, `Use at least ${rules.ticketSubjectMin} characters`)
      .max(rules.ticketSubjectMax, `Use at most ${rules.ticketSubjectMax} characters`),
    message: z
      .string()
      .trim()
      .min(rules.ticketMessageMin, `Tell us a bit more (at least ${rules.ticketMessageMin} characters)`)
      .max(rules.ticketMessageMax, `Use at most ${rules.ticketMessageMax} characters`),
  });

export type TicketValues = z.infer<ReturnType<typeof ticketSchema>>;

/** No category preselected: the user picks one */
export const ticketDefaults: DefaultValues<TicketValues> = { subject: '', message: '' };
