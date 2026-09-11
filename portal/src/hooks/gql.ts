import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { TypedDocumentString } from '@/gql/graphql';
import { gql } from '@/lib/api';

/** Query keys (mutations invalidate by prefix) */
export const keys = {
  stats: ['stats'],
  logs: ['logs'],
  log: ['log'],
  users: ['users'],
  user: ['user'],
  tickets: ['tickets'],
  ticket: ['ticket'],
  env: ['env'],
  slack: ['slack'],
  models: ['models'],
  rules: ['rules'],
  timeZones: ['timeZones'],
} satisfies Record<string, QueryKey>;

/** Typed GraphQL query; keeps the previous page on screen while the next one loads */
export function useGqlQuery<TResult, TVariables>(
  key: QueryKey,
  document: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
  options: { enabled?: boolean; staleTime?: number } = {},
) {
  return useQuery({
    queryKey: [...key, variables ?? null],
    queryFn: () => gql(document, variables),
    placeholderData: keepPreviousData,
    ...options,
  });
}

/** Typed GraphQL mutation that refreshes the given queries on success */
export function useGqlMutation<TResult, TVariables>(document: TypedDocumentString<TResult, TVariables>, refresh: QueryKey[] = []) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables: TVariables) => gql(document, variables),
    onSuccess: () => Promise.all(refresh.map((queryKey) => qc.invalidateQueries({ queryKey }))),
  });
}
