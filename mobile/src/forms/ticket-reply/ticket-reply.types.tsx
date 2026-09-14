import { z } from 'zod';
import type { ValidationRules } from '@/lib/types';

export const ticketReplySchema = (rules: ValidationRules) =>
  z.object({
    body: z.string().trim().min(1, 'Write a message').max(rules.ticketMessageMax, `Use at most ${rules.ticketMessageMax} characters`),
  });

export type TicketReplyValues = z.infer<ReturnType<typeof ticketReplySchema>>;

export const ticketReplyDefaults: TicketReplyValues = { body: '' };
