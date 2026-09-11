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
import { gql } from '@/lib/api';
import type { ChatMessage, ReportInput, TransactionFilter } from '@/lib/types';
import { keys } from './keys';

const FIVE_MINUTES = 5 * 60_000;
const PAGE = 30;

export const useCategories = () =>
  useQuery({ queryKey: keys.categories, queryFn: () => gql(CategoriesQuery).then((d) => d.categories), staleTime: FIVE_MINUTES });

export function useCategoryMap() {
  const { data } = useCategories();
  return useMemo(() => new Map((data ?? []).map((c) => [c.id, c])), [data]);
}

export const useSources = () =>
  useQuery({ queryKey: keys.sources, queryFn: () => gql(SourcesQuery).then((d) => d.paymentSources), staleTime: FIVE_MINUTES });

/** ISO 4217 currencies, IANA time zones and chat starter prompts (served by the API) */
export const useReference = () => useQuery({ queryKey: keys.reference, queryFn: () => gql(ReferenceQuery), staleTime: Infinity });

export const useDashboard = (month: string) =>
  useQuery({
    queryKey: keys.dashboard(month),
    queryFn: () => gql(DashboardQuery, { month }).then((d) => d.dashboard),
    placeholderData: (prev) => prev,
  });

export const useReport = (input: ReportInput) =>
  useQuery({ queryKey: keys.report(input), queryFn: () => gql(ReportQuery, { input }).then((d) => d.report), placeholderData: (prev) => prev });

export const useTransactions = (filter: TransactionFilter) =>
  useInfiniteQuery({
    queryKey: keys.transactions(filter),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => gql(TransactionsQuery, { filter, limit: PAGE, offset: pageParam }).then((d) => d.transactions),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length * PAGE : undefined),
  });

export const useTransaction = (id?: string) =>
  useQuery({ queryKey: keys.transaction(id), queryFn: () => gql(TransactionQuery, { id: id ?? '' }).then((d) => d.transaction), enabled: !!id });

export const useChatHistory = () =>
  useQuery({ queryKey: keys.chat, queryFn: () => gql(ChatHistoryQuery, { limit: 80 }).then((d): ChatMessage[] => d.chatHistory) });

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
