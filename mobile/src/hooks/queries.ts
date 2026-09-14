import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  CategoriesQuery,
  ChatHistoryQuery,
  DashboardQuery,
  EnvVarsQuery,
  OpenAiModelsQuery,
  ReferenceQuery,
  ReportQuery,
  SlackChannelsQuery,
  SourcesQuery,
  TransactionQuery,
  TransactionsQuery,
} from '@/graphql/queries';
import { MyTicketsQuery, TicketQuery, ValidationRulesQuery } from '@/graphql/support';
import { EmailReportsQuery } from '@/graphql/trackers';
import { gql } from '@/lib/api';
import { useTracker } from '@/lib/tracker';
import type { ChatMessage, ReportInput, TransactionFilter } from '@/lib/types';
import { keys } from './keys';

const FIVE_MINUTES = 5 * 60_000;
const PAGE = 30;

/** Every tracker-scoped request goes to the tracker the app is showing */
export const useTrackerId = () => useTracker().id;

export function useCategories() {
  const trackerId = useTrackerId();
  return useQuery({
    queryKey: keys.categories(trackerId),
    queryFn: () => gql(CategoriesQuery, { trackerId }).then((d) => d.categories),
    staleTime: FIVE_MINUTES,
  });
}

export function useCategoryMap() {
  const { data } = useCategories();
  return useMemo(() => new Map((data ?? []).map((c) => [c.id, c])), [data]);
}

export function useSources() {
  const trackerId = useTrackerId();
  return useQuery({
    queryKey: keys.sources(trackerId),
    queryFn: () => gql(SourcesQuery, { trackerId }).then((d) => d.paymentSources),
    staleTime: FIVE_MINUTES,
  });
}

/** ISO 4217 currencies, IANA time zones and chat starter prompts (served by the API) */
export const useReference = () => useQuery({ queryKey: keys.reference, queryFn: () => gql(ReferenceQuery), staleTime: Infinity });

export function useDashboard(month: string) {
  const trackerId = useTrackerId();
  return useQuery({
    queryKey: keys.dashboard(trackerId, month),
    queryFn: () => gql(DashboardQuery, { trackerId, month }).then((d) => d.dashboard),
    placeholderData: (prev, prevQuery) => (prevQuery?.queryKey[1] === trackerId ? prev : undefined),
  });
}

export function useReport(input: ReportInput) {
  const trackerId = useTrackerId();
  return useQuery({
    queryKey: keys.report(trackerId, input),
    queryFn: () => gql(ReportQuery, { trackerId, input }).then((d) => d.report),
    placeholderData: (prev, prevQuery) => (prevQuery?.queryKey[1] === trackerId ? prev : undefined),
  });
}

export function useTransactions(filter: TransactionFilter) {
  const trackerId = useTrackerId();
  return useInfiniteQuery({
    queryKey: keys.transactions(trackerId, filter),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => gql(TransactionsQuery, { trackerId, filter, limit: PAGE, offset: pageParam }).then((d) => d.transactions),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length * PAGE : undefined),
  });
}

export const useTransaction = (id?: string) =>
  useQuery({ queryKey: keys.transaction(id), queryFn: () => gql(TransactionQuery, { id: id ?? '' }).then((d) => d.transaction), enabled: !!id });

export function useChatHistory() {
  const trackerId = useTrackerId();
  return useQuery({
    queryKey: keys.chat(trackerId),
    queryFn: () => gql(ChatHistoryQuery, { trackerId, limit: 80 }).then((d): ChatMessage[] => d.chatHistory),
  });
}

export function useEmailReports() {
  const trackerId = useTrackerId();
  return useQuery({ queryKey: keys.emailReports(trackerId), queryFn: () => gql(EmailReportsQuery, { trackerId }).then((d) => d.emailReports) });
}

export const useEnvVars = (enabled: boolean) => useQuery({ queryKey: keys.env, queryFn: () => gql(EnvVarsQuery).then((d) => d.envVars), enabled });

export const useSlackChannels = (enabled: boolean) =>
  useQuery({ queryKey: keys.slack, queryFn: () => gql(SlackChannelsQuery).then((d) => d.slackChannels), enabled, retry: false });

export const useOpenAiModels = (enabled: boolean) =>
  useQuery({ queryKey: keys.models, queryFn: () => gql(OpenAiModelsQuery).then((d) => d.openAiModels), enabled, staleTime: FIVE_MINUTES * 2 });

/** Form limits from the API, so forms validate exactly like the server */
export const useValidationRules = () =>
  useQuery({ queryKey: keys.rules, queryFn: () => gql(ValidationRulesQuery).then((d) => d.validationRules), staleTime: Infinity });

export const useMyTickets = () => useQuery({ queryKey: keys.tickets, queryFn: () => gql(MyTicketsQuery).then((d) => d.mySupportTickets) });

export const useTicket = (id: string) =>
  useQuery({ queryKey: keys.ticket(id), queryFn: () => gql(TicketQuery, { id }).then((d) => d.supportTicket), enabled: !!id });
