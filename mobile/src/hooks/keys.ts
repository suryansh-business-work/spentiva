import { useQueryClient } from '@tanstack/react-query';
import type { ReportInput, TransactionFilter } from '@/lib/types';

/** Tracker data is keyed by tracker, so switching trackers never shows another tracker's numbers */
export const keys = {
  trackers: ['trackers'] as const,
  categories: (trackerId: string) => ['categories', trackerId] as const,
  sources: (trackerId: string) => ['sources', trackerId] as const,
  reference: ['reference'] as const,
  dashboard: (trackerId: string, month: string) => ['dashboard', trackerId, month] as const,
  report: (trackerId: string, input: ReportInput) => ['report', trackerId, input] as const,
  transactions: (trackerId: string, filter: TransactionFilter) => ['transactions', trackerId, filter] as const,
  transaction: (id?: string) => ['transaction', id] as const,
  chat: (trackerId: string) => ['chat', trackerId] as const,
  emailReports: (trackerId: string) => ['emailReports', trackerId] as const,
  env: ['env'] as const,
  slack: ['slackChannels'] as const,
  models: ['openAiModels'] as const,
  rules: ['validationRules'] as const,
  tickets: ['supportTickets'] as const,
  ticket: (id: string) => ['supportTicket', id] as const,
};

/** Anything that changes money totals refreshes these */
export function useInvalidateMoney() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['dashboard'] }),
      qc.invalidateQueries({ queryKey: ['report'] }),
      qc.invalidateQueries({ queryKey: ['transactions'] }),
      qc.invalidateQueries({ queryKey: ['transaction'] }),
    ]);
}
