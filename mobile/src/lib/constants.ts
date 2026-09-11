import type { Period, ReportFrequency, ReportKind, TicketCategory, TicketStatus, TrackerKind, TrackerRole } from './types';

/** UI configuration (labels & palettes). Business data comes from the API. */

export const CATEGORY_COLORS = [
  '#5DA314',
  '#84CC16',
  '#16A34A',
  '#0D9488',
  '#14B8A6',
  '#22C3E6',
  '#0EA5E9',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#E5484D',
  '#F97316',
  '#F59E0B',
  '#F2B705',
  '#6B7280',
  '#151515',
];

export const REPORT_KINDS: { value: ReportKind; label: string }[] = [
  { value: 'CATEGORY', label: 'Category' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'TOP', label: 'Top spend' },
  { value: 'AVERAGE', label: 'Average' },
  { value: 'INCOME_VS_EXPENSE', label: 'Income vs Expense' },
  { value: 'SOURCE', label: 'Payment mode' },
  { value: 'EXPENSE_ON', label: 'Expense on' },
];

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'THIS_WEEK', label: 'This week' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'LAST_MONTH', label: 'Last month' },
  { value: 'LAST_90_DAYS', label: '90 days' },
  { value: 'THIS_QUARTER', label: 'This quarter' },
  { value: 'LAST_6_MONTHS', label: '6 months' },
  { value: 'THIS_YEAR', label: 'This year' },
  { value: 'ALL_TIME', label: 'All time' },
];

export const TX_TYPE_OPTIONS = [
  { value: 'EXPENSE' as const, label: 'Expense' },
  { value: 'INCOME' as const, label: 'Income' },
];

/** Trackers (values come from the API's TrackerKind / TrackerRole enums) */
export const TRACKER_KIND_OPTIONS: { value: TrackerKind; label: string }[] = [
  { value: 'PERSONAL', label: 'Home & personal' },
  { value: 'BUSINESS', label: 'Business' },
];

export const TRACKER_ROLE_LABELS: Record<TrackerRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Can edit',
  VIEWER: 'View only',
};

/** Roles a tracker can be shared with (the owner is whoever created it) */
export const MEMBER_ROLE_OPTIONS: { value: Exclude<TrackerRole, 'OWNER'>; label: string }[] = [
  { value: 'EDITOR', label: 'Can edit' },
  { value: 'VIEWER', label: 'View only' },
];

/** Email reports: what each one covers and when it arrives */
export const REPORT_FREQUENCY_OPTIONS: { value: ReportFrequency; label: string; hint: string }[] = [
  { value: 'DAILY', label: 'Daily', hint: 'Every morning, for the day before' },
  { value: 'MONTHLY', label: 'Monthly', hint: 'On the 1st, for the month before' },
  { value: 'QUARTERLY', label: 'Quarterly', hint: '1 Jan, Apr, Jul and Oct, for the quarter before' },
  { value: 'YEARLY', label: 'Yearly', hint: 'On 1 January, for the year before' },
];

/** Periods a report can be emailed for right away */
export const EMAIL_PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'TODAY', label: 'Today' },
  { value: 'YESTERDAY', label: 'Yesterday' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'LAST_MONTH', label: 'Last month' },
  { value: 'THIS_QUARTER', label: 'This quarter' },
  { value: 'LAST_QUARTER', label: 'Last quarter' },
  { value: 'THIS_YEAR', label: 'This year' },
  { value: 'LAST_YEAR', label: 'Last year' },
];

/** Help & support (values come from the API's TicketCategory / TicketStatus enums) */
export const TICKET_CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: 'BUG', label: 'Bug / crash' },
  { value: 'QUESTION', label: 'Question' },
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'OTHER', label: 'Other' },
];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};
