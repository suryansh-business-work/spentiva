import { useQueryClient } from '@tanstack/react-query';
import type { ReportInput, TransactionFilter } from '@/lib/types';

export const keys = {
  categories: ['categories'] as const,
  sources: ['sources'] as const,
  reference: ['reference'] as const,
  dashboard: (month: string) => ['dashboard', month] as const,
  report: (input: ReportInput) => ['report', input] as const,
  transactions: (filter: TransactionFilter) => ['transactions', filter] as const,
  transaction: (id?: string) => ['transaction', id] as const,
  chat: ['chat'] as const,
  env: ['env'] as const,
  slack: ['slackChannels'] as const,
  models: ['openAiModels'] as const,
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
