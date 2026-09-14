import type { LogLevel, LogSource, TicketCategory, TicketPriority, TicketStatus, UserRole } from '@/gql/graphql';

/** Display labels for the API's enums (UI configuration, the values themselves come from the API) */
export const LEVEL_LABELS: Record<LogLevel, string> = { FATAL: 'Crash', ERROR: 'Error', WARN: 'Warning', INFO: 'Info' };
export const SOURCE_LABELS: Record<LogSource, string> = { APP: 'App', PORTAL: 'Portal', API: 'API' };
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};
export const PRIORITY_LABELS: Record<TicketPriority, string> = { LOW: 'Low', NORMAL: 'Normal', HIGH: 'High', URGENT: 'Urgent' };
export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  BUG: 'Bug / crash',
  QUESTION: 'Question',
  FEEDBACK: 'Feedback',
  ACCOUNT: 'Account',
  OTHER: 'Other',
};
export const ROLE_LABELS: Record<UserRole, string> = { USER: 'User', ADMIN: 'Admin' };

export interface Option<V extends string = string> {
  value: V;
  label: string;
}

/** Select options from a label map, in declaration order */
export const optionsOf = <V extends string>(labels: Record<V, string>): Option<V>[] =>
  (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));
