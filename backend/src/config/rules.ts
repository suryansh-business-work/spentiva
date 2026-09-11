/**
 * Form limits the API enforces. Served to the app and the portal through the public
 * `validationRules` query, so their zod schemas validate exactly like the server does.
 */
export const RULES = {
  nameMax: 60,
  passwordMin: 6,
  passwordMax: 100,
  ticketSubjectMin: 4,
  ticketSubjectMax: 120,
  ticketMessageMin: 10,
  ticketMessageMax: 4000,
  searchMax: 100,
} as const;

/** Client log limits (reportLogs is public, so every field is capped) */
export const LOG_LIMITS = {
  batch: 20,
  message: 2_000,
  stack: 20_000,
  context: 8_000,
  field: 300,
  /** Entries accepted per IP per minute */
  perMinute: 120,
  retentionDays: 90,
} as const;
