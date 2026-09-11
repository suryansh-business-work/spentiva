import type { LogFilter, PageInput, TicketFilter, UserFilter } from '@/gql/graphql';
import { TimeZonesQuery, ValidationRulesQuery } from '@/graphql/auth';
import { AdminLogQuery, AdminLogsQuery, LogOccurrencesQuery } from '@/graphql/logs';
import { EnvVarsQuery, OpenAiModelsQuery, SlackChannelsQuery } from '@/graphql/settings';
import { AdminTicketsQuery, TicketQuery } from '@/graphql/support';
import { AdminStatsQuery, AdminUserQuery, AdminUsersQuery } from '@/graphql/users';
import { keys, useGqlQuery } from './gql';

const STATIC = { staleTime: Infinity };

export const useStats = () => useGqlQuery(keys.stats, AdminStatsQuery);
export const useRules = () => useGqlQuery(keys.rules, ValidationRulesQuery, undefined, STATIC);
export const useTimeZones = () => useGqlQuery(keys.timeZones, TimeZonesQuery, undefined, STATIC);

export const useLogs = (filter: LogFilter, page: PageInput) => useGqlQuery(keys.logs, AdminLogsQuery, { filter, page });
export const useLog = (id: string | null) => useGqlQuery(keys.log, AdminLogQuery, { id: id ?? '' }, { enabled: Boolean(id) });
export const useOccurrences = (fingerprint: string | undefined) =>
  useGqlQuery(keys.log, LogOccurrencesQuery, { fingerprint: fingerprint ?? '' }, { enabled: Boolean(fingerprint) });

export const useUsers = (filter: UserFilter, page: PageInput) => useGqlQuery(keys.users, AdminUsersQuery, { filter, page });
export const useUser = (id: string) => useGqlQuery(keys.user, AdminUserQuery, { id });

export const useTickets = (filter: TicketFilter, page: PageInput) => useGqlQuery(keys.tickets, AdminTicketsQuery, { filter, page });
export const useTicket = (id: string) => useGqlQuery(keys.ticket, TicketQuery, { id });

export const useEnvVars = () => useGqlQuery(keys.env, EnvVarsQuery);
export const useSlackChannels = (enabled: boolean) => useGqlQuery(keys.slack, SlackChannelsQuery, undefined, { enabled });
export const useOpenAiModels = (enabled: boolean) => useGqlQuery(keys.models, OpenAiModelsQuery, undefined, { ...STATIC, enabled });
