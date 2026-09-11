/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type ClientLogInput = {
  apiUrl?: string | null | undefined;
  appVersion?: string | null | undefined;
  buildNumber?: string | null | undefined;
  context?: string | null | undefined;
  device?: string | null | undefined;
  level: LogLevel;
  message: string;
  occurredAt?: string | null | undefined;
  osVersion?: string | null | undefined;
  platform?: string | null | undefined;
  /** APP or PORTAL */
  source: LogSource;
  stack?: string | null | undefined;
  url?: string | null | undefined;
};

export type EnvSource =
  | 'APP'
  | 'NONE'
  | 'SERVER_ENV';

export type EnvVarInput = {
  key: string;
  /** Empty or null clears the value */
  value?: string | null | undefined;
};

export type LogFilter = {
  appVersion?: string | null | undefined;
  fingerprint?: string | null | undefined;
  from?: string | null | undefined;
  levels?: Array<LogLevel> | null | undefined;
  platform?: string | null | undefined;
  resolved?: boolean | null | undefined;
  search?: string | null | undefined;
  source?: LogSource | null | undefined;
  to?: string | null | undefined;
  userId?: string | number | null | undefined;
};

export type LogLevel =
  | 'ERROR'
  | 'FATAL'
  | 'INFO'
  | 'WARN';

export type LogSource =
  | 'API'
  | 'APP'
  | 'PORTAL';

export type LoginInput = {
  email: string;
  password: string;
};

/** Portal table paging (page is 0-based) */
export type PageInput = {
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  sortBy?: string | null | undefined;
  sortDir?: SortDirection | null | undefined;
};

export type ProfileInput = {
  currency?: string | null | undefined;
  locale?: string | null | undefined;
  monthlyBudget?: number | null | undefined;
  name?: string | null | undefined;
  timezone?: string | null | undefined;
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type TicketAuthor =
  | 'ADMIN'
  | 'USER';

export type TicketCategory =
  | 'ACCOUNT'
  | 'BUG'
  | 'FEEDBACK'
  | 'OTHER'
  | 'QUESTION';

export type TicketFilter = {
  category?: TicketCategory | null | undefined;
  priority?: TicketPriority | null | undefined;
  search?: string | null | undefined;
  status?: TicketStatus | null | undefined;
  userId?: string | number | null | undefined;
};

export type TicketPriority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT';

export type TicketStatus =
  | 'CLOSED'
  | 'IN_PROGRESS'
  | 'OPEN'
  | 'RESOLVED';

export type TicketUpdateInput = {
  priority?: TicketPriority | null | undefined;
  status?: TicketStatus | null | undefined;
};

export type UserFilter = {
  disabled?: boolean | null | undefined;
  role?: UserRole | null | undefined;
  search?: string | null | undefined;
};

export type UserRole =
  | 'ADMIN'
  | 'USER';

export type UserUpdateInput = {
  disabled?: boolean | null | undefined;
  name?: string | null | undefined;
  role?: UserRole | null | undefined;
};

export type PortalLoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type PortalLoginMutation = { login: { token: string, user: { id: string, name: string, email: string, timezone: string, locale: string, isAdmin: boolean } } };

export type PortalMeQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalMeQuery = { me: { id: string, name: string, email: string, timezone: string, locale: string, isAdmin: boolean } | null };

export type PortalUpdateDisplayMutationVariables = Exact<{
  input: ProfileInput;
}>;


export type PortalUpdateDisplayMutation = { updateProfile: { id: string, name: string, email: string, timezone: string, locale: string, isAdmin: boolean } };

export type PortalTimeZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalTimeZonesQuery = { timeZones: Array<string> };

export type PortalValidationRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalValidationRulesQuery = { validationRules: { nameMax: number, passwordMin: number, passwordMax: number, ticketSubjectMin: number, ticketSubjectMax: number, ticketMessageMin: number, ticketMessageMax: number, searchMax: number } };

export type MeFieldsFragment = { id: string, name: string, email: string, timezone: string, locale: string, isAdmin: boolean };

export type RulesFieldsFragment = { nameMax: number, passwordMin: number, passwordMax: number, ticketSubjectMin: number, ticketSubjectMax: number, ticketMessageMin: number, ticketMessageMax: number, searchMax: number };

export type LogRowFieldsFragment = { id: string, level: LogLevel, source: LogSource, message: string, url: string | null, userId: string | null, userEmail: string | null, appVersion: string | null, platform: string | null, device: string | null, fingerprint: string, occurredAt: string, resolved: boolean };

export type LogDetailFieldsFragment = { stack: string | null, buildNumber: string | null, osVersion: string | null, apiUrl: string | null, context: string | null, ip: string | null, userAgent: string | null, createdAt: string, resolvedAt: string | null, id: string, level: LogLevel, source: LogSource, message: string, url: string | null, userId: string | null, userEmail: string | null, appVersion: string | null, platform: string | null, device: string | null, fingerprint: string, occurredAt: string, resolved: boolean };

export type AdminUserFieldsFragment = { id: string, name: string, email: string, role: UserRole, disabled: boolean, currency: string, timezone: string, locale: string, appVersion: string | null, platform: string | null, lastSeenAt: string | null, createdAt: string, transactionCount: number, errorCount: number, ticketCount: number };

export type TicketRowFieldsFragment = { id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, user: { id: string, name: string, email: string } | null };

export type TicketDetailFieldsFragment = { updatedAt: string, id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, messages: Array<{ id: string, author: TicketAuthor, authorName: string, body: string, createdAt: string }>, user: { id: string, name: string, email: string } | null };

export type EnvFieldsFragment = { key: string, label: string, group: string, secret: boolean, isSet: boolean, value: string | null, source: EnvSource };

export type AdminLogsQueryVariables = Exact<{
  filter?: LogFilter | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type AdminLogsQuery = { adminLogs: { total: number, items: Array<{ id: string, level: LogLevel, source: LogSource, message: string, url: string | null, userId: string | null, userEmail: string | null, appVersion: string | null, platform: string | null, device: string | null, fingerprint: string, occurredAt: string, resolved: boolean }> } };

export type AdminLogQueryVariables = Exact<{
  id: string | number;
}>;


export type AdminLogQuery = { adminLog: { stack: string | null, buildNumber: string | null, osVersion: string | null, apiUrl: string | null, context: string | null, ip: string | null, userAgent: string | null, createdAt: string, resolvedAt: string | null, id: string, level: LogLevel, source: LogSource, message: string, url: string | null, userId: string | null, userEmail: string | null, appVersion: string | null, platform: string | null, device: string | null, fingerprint: string, occurredAt: string, resolved: boolean } | null };

export type AdminLogOccurrencesQueryVariables = Exact<{
  fingerprint: string;
}>;


export type AdminLogOccurrencesQuery = { adminLogOccurrences: { count: number, users: number, firstAt: string, lastAt: string } | null };

export type AdminResolveLogsMutationVariables = Exact<{
  ids?: Array<string | number> | string | number | null | undefined;
  fingerprint?: string | null | undefined;
  resolved: boolean;
}>;


export type AdminResolveLogsMutation = { adminResolveLogs: number };

export type AdminDeleteLogsMutationVariables = Exact<{
  ids: Array<string | number> | string | number;
}>;


export type AdminDeleteLogsMutation = { adminDeleteLogs: number };

export type PortalReportLogsMutationVariables = Exact<{
  input: Array<ClientLogInput> | ClientLogInput;
}>;


export type PortalReportLogsMutation = { reportLogs: number };

export type PortalEnvVarsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalEnvVarsQuery = { envVars: Array<{ key: string, label: string, group: string, secret: boolean, isSet: boolean, value: string | null, source: EnvSource }> };

export type PortalSlackChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalSlackChannelsQuery = { slackChannels: Array<{ id: string, name: string, isPrivate: boolean, isMember: boolean }> };

export type PortalOpenAiModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalOpenAiModelsQuery = { openAiModels: Array<string> };

export type PortalSetEnvVarsMutationVariables = Exact<{
  input: Array<EnvVarInput> | EnvVarInput;
}>;


export type PortalSetEnvVarsMutation = { setEnvVars: Array<{ key: string, label: string, group: string, secret: boolean, isSet: boolean, value: string | null, source: EnvSource }> };

export type PortalTestSlackMutationVariables = Exact<{ [key: string]: never; }>;


export type PortalTestSlackMutation = { testSlack: boolean };

export type PortalTestOpenAiMutationVariables = Exact<{ [key: string]: never; }>;


export type PortalTestOpenAiMutation = { testOpenAi: string };

export type AdminTicketsQueryVariables = Exact<{
  filter?: TicketFilter | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type AdminTicketsQuery = { adminTickets: { total: number, items: Array<{ id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, user: { id: string, name: string, email: string } | null }> } };

export type AdminTicketQueryVariables = Exact<{
  id: string | number;
}>;


export type AdminTicketQuery = { supportTicket: { updatedAt: string, id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, messages: Array<{ id: string, author: TicketAuthor, authorName: string, body: string, createdAt: string }>, user: { id: string, name: string, email: string } | null } | null };

export type AdminReplyTicketMutationVariables = Exact<{
  id: string | number;
  body: string;
  status?: TicketStatus | null | undefined;
}>;


export type AdminReplyTicketMutation = { adminReplyTicket: { updatedAt: string, id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, messages: Array<{ id: string, author: TicketAuthor, authorName: string, body: string, createdAt: string }>, user: { id: string, name: string, email: string } | null } };

export type AdminUpdateTicketMutationVariables = Exact<{
  id: string | number;
  input: TicketUpdateInput;
}>;


export type AdminUpdateTicketMutation = { adminUpdateTicket: { updatedAt: string, id: string, subject: string, category: TicketCategory, status: TicketStatus, priority: TicketPriority, messageCount: number, lastAuthor: TicketAuthor, appVersion: string | null, platform: string | null, lastMessageAt: string, createdAt: string, messages: Array<{ id: string, author: TicketAuthor, authorName: string, body: string, createdAt: string }>, user: { id: string, name: string, email: string } | null } };

export type AdminStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminStatsQuery = { adminStats: { users: number, newUsers7d: number, activeUsers7d: number, disabledUsers: number, transactions7d: number, crashes24h: number, errors24h: number, unresolvedErrors: number, openTickets: number, logsByDay: Array<{ date: string, fatal: number, error: number, warn: number }>, signupsByDay: Array<{ date: string, count: number }>, appVersions: Array<{ name: string, count: number }>, topErrors: Array<{ fingerprint: string, message: string, level: LogLevel, source: LogSource, count: number, users: number, lastAt: string, logId: string }> } };

export type AdminUsersQueryVariables = Exact<{
  filter?: UserFilter | null | undefined;
  page?: PageInput | null | undefined;
}>;


export type AdminUsersQuery = { adminUsers: { total: number, items: Array<{ id: string, name: string, email: string, role: UserRole, disabled: boolean, currency: string, timezone: string, locale: string, appVersion: string | null, platform: string | null, lastSeenAt: string | null, createdAt: string, transactionCount: number, errorCount: number, ticketCount: number }> } };

export type AdminUserQueryVariables = Exact<{
  id: string | number;
}>;


export type AdminUserQuery = { adminUser: { id: string, name: string, email: string, role: UserRole, disabled: boolean, currency: string, timezone: string, locale: string, appVersion: string | null, platform: string | null, lastSeenAt: string | null, createdAt: string, transactionCount: number, errorCount: number, ticketCount: number } | null };

export type AdminUpdateUserMutationVariables = Exact<{
  id: string | number;
  input: UserUpdateInput;
}>;


export type AdminUpdateUserMutation = { adminUpdateUser: { id: string, name: string, email: string, role: UserRole, disabled: boolean, currency: string, timezone: string, locale: string, appVersion: string | null, platform: string | null, lastSeenAt: string | null, createdAt: string, transactionCount: number, errorCount: number, ticketCount: number } };

export type AdminResetPasswordMutationVariables = Exact<{
  id: string | number;
  password: string;
}>;


export type AdminResetPasswordMutation = { adminResetPassword: boolean };

export type AdminDeleteUserMutationVariables = Exact<{
  id: string | number;
}>;


export type AdminDeleteUserMutation = { adminDeleteUser: boolean };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const MeFieldsFragmentDoc = new TypedDocumentString(`
    fragment MeFields on User {
  id
  name
  email
  timezone
  locale
  isAdmin
}
    `, {"fragmentName":"MeFields"}) as unknown as TypedDocumentString<MeFieldsFragment, unknown>;
export const RulesFieldsFragmentDoc = new TypedDocumentString(`
    fragment RulesFields on ValidationRules {
  nameMax
  passwordMin
  passwordMax
  ticketSubjectMin
  ticketSubjectMax
  ticketMessageMin
  ticketMessageMax
  searchMax
}
    `, {"fragmentName":"RulesFields"}) as unknown as TypedDocumentString<RulesFieldsFragment, unknown>;
export const LogRowFieldsFragmentDoc = new TypedDocumentString(`
    fragment LogRowFields on AppLog {
  id
  level
  source
  message
  url
  userId
  userEmail
  appVersion
  platform
  device
  fingerprint
  occurredAt
  resolved
}
    `, {"fragmentName":"LogRowFields"}) as unknown as TypedDocumentString<LogRowFieldsFragment, unknown>;
export const LogDetailFieldsFragmentDoc = new TypedDocumentString(`
    fragment LogDetailFields on AppLog {
  ...LogRowFields
  stack
  buildNumber
  osVersion
  apiUrl
  context
  ip
  userAgent
  createdAt
  resolvedAt
}
    fragment LogRowFields on AppLog {
  id
  level
  source
  message
  url
  userId
  userEmail
  appVersion
  platform
  device
  fingerprint
  occurredAt
  resolved
}`, {"fragmentName":"LogDetailFields"}) as unknown as TypedDocumentString<LogDetailFieldsFragment, unknown>;
export const AdminUserFieldsFragmentDoc = new TypedDocumentString(`
    fragment AdminUserFields on AdminUser {
  id
  name
  email
  role
  disabled
  currency
  timezone
  locale
  appVersion
  platform
  lastSeenAt
  createdAt
  transactionCount
  errorCount
  ticketCount
}
    `, {"fragmentName":"AdminUserFields"}) as unknown as TypedDocumentString<AdminUserFieldsFragment, unknown>;
export const TicketRowFieldsFragmentDoc = new TypedDocumentString(`
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}
    `, {"fragmentName":"TicketRowFields"}) as unknown as TypedDocumentString<TicketRowFieldsFragment, unknown>;
export const TicketDetailFieldsFragmentDoc = new TypedDocumentString(`
    fragment TicketDetailFields on SupportTicket {
  ...TicketRowFields
  updatedAt
  messages {
    id
    author
    authorName
    body
    createdAt
  }
}
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}`, {"fragmentName":"TicketDetailFields"}) as unknown as TypedDocumentString<TicketDetailFieldsFragment, unknown>;
export const EnvFieldsFragmentDoc = new TypedDocumentString(`
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}
    `, {"fragmentName":"EnvFields"}) as unknown as TypedDocumentString<EnvFieldsFragment, unknown>;
export const PortalLoginDocument = new TypedDocumentString(`
    mutation PortalLogin($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      ...MeFields
    }
  }
}
    fragment MeFields on User {
  id
  name
  email
  timezone
  locale
  isAdmin
}`) as unknown as TypedDocumentString<PortalLoginMutation, PortalLoginMutationVariables>;
export const PortalMeDocument = new TypedDocumentString(`
    query PortalMe {
  me {
    ...MeFields
  }
}
    fragment MeFields on User {
  id
  name
  email
  timezone
  locale
  isAdmin
}`) as unknown as TypedDocumentString<PortalMeQuery, PortalMeQueryVariables>;
export const PortalUpdateDisplayDocument = new TypedDocumentString(`
    mutation PortalUpdateDisplay($input: ProfileInput!) {
  updateProfile(input: $input) {
    ...MeFields
  }
}
    fragment MeFields on User {
  id
  name
  email
  timezone
  locale
  isAdmin
}`) as unknown as TypedDocumentString<PortalUpdateDisplayMutation, PortalUpdateDisplayMutationVariables>;
export const PortalTimeZonesDocument = new TypedDocumentString(`
    query PortalTimeZones {
  timeZones
}
    `) as unknown as TypedDocumentString<PortalTimeZonesQuery, PortalTimeZonesQueryVariables>;
export const PortalValidationRulesDocument = new TypedDocumentString(`
    query PortalValidationRules {
  validationRules {
    ...RulesFields
  }
}
    fragment RulesFields on ValidationRules {
  nameMax
  passwordMin
  passwordMax
  ticketSubjectMin
  ticketSubjectMax
  ticketMessageMin
  ticketMessageMax
  searchMax
}`) as unknown as TypedDocumentString<PortalValidationRulesQuery, PortalValidationRulesQueryVariables>;
export const AdminLogsDocument = new TypedDocumentString(`
    query AdminLogs($filter: LogFilter, $page: PageInput) {
  adminLogs(filter: $filter, page: $page) {
    total
    items {
      ...LogRowFields
    }
  }
}
    fragment LogRowFields on AppLog {
  id
  level
  source
  message
  url
  userId
  userEmail
  appVersion
  platform
  device
  fingerprint
  occurredAt
  resolved
}`) as unknown as TypedDocumentString<AdminLogsQuery, AdminLogsQueryVariables>;
export const AdminLogDocument = new TypedDocumentString(`
    query AdminLog($id: ID!) {
  adminLog(id: $id) {
    ...LogDetailFields
  }
}
    fragment LogRowFields on AppLog {
  id
  level
  source
  message
  url
  userId
  userEmail
  appVersion
  platform
  device
  fingerprint
  occurredAt
  resolved
}
fragment LogDetailFields on AppLog {
  ...LogRowFields
  stack
  buildNumber
  osVersion
  apiUrl
  context
  ip
  userAgent
  createdAt
  resolvedAt
}`) as unknown as TypedDocumentString<AdminLogQuery, AdminLogQueryVariables>;
export const AdminLogOccurrencesDocument = new TypedDocumentString(`
    query AdminLogOccurrences($fingerprint: String!) {
  adminLogOccurrences(fingerprint: $fingerprint) {
    count
    users
    firstAt
    lastAt
  }
}
    `) as unknown as TypedDocumentString<AdminLogOccurrencesQuery, AdminLogOccurrencesQueryVariables>;
export const AdminResolveLogsDocument = new TypedDocumentString(`
    mutation AdminResolveLogs($ids: [ID!], $fingerprint: String, $resolved: Boolean!) {
  adminResolveLogs(ids: $ids, fingerprint: $fingerprint, resolved: $resolved)
}
    `) as unknown as TypedDocumentString<AdminResolveLogsMutation, AdminResolveLogsMutationVariables>;
export const AdminDeleteLogsDocument = new TypedDocumentString(`
    mutation AdminDeleteLogs($ids: [ID!]!) {
  adminDeleteLogs(ids: $ids)
}
    `) as unknown as TypedDocumentString<AdminDeleteLogsMutation, AdminDeleteLogsMutationVariables>;
export const PortalReportLogsDocument = new TypedDocumentString(`
    mutation PortalReportLogs($input: [ClientLogInput!]!) {
  reportLogs(input: $input)
}
    `) as unknown as TypedDocumentString<PortalReportLogsMutation, PortalReportLogsMutationVariables>;
export const PortalEnvVarsDocument = new TypedDocumentString(`
    query PortalEnvVars {
  envVars {
    ...EnvFields
  }
}
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}`) as unknown as TypedDocumentString<PortalEnvVarsQuery, PortalEnvVarsQueryVariables>;
export const PortalSlackChannelsDocument = new TypedDocumentString(`
    query PortalSlackChannels {
  slackChannels {
    id
    name
    isPrivate
    isMember
  }
}
    `) as unknown as TypedDocumentString<PortalSlackChannelsQuery, PortalSlackChannelsQueryVariables>;
export const PortalOpenAiModelsDocument = new TypedDocumentString(`
    query PortalOpenAiModels {
  openAiModels
}
    `) as unknown as TypedDocumentString<PortalOpenAiModelsQuery, PortalOpenAiModelsQueryVariables>;
export const PortalSetEnvVarsDocument = new TypedDocumentString(`
    mutation PortalSetEnvVars($input: [EnvVarInput!]!) {
  setEnvVars(input: $input) {
    ...EnvFields
  }
}
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}`) as unknown as TypedDocumentString<PortalSetEnvVarsMutation, PortalSetEnvVarsMutationVariables>;
export const PortalTestSlackDocument = new TypedDocumentString(`
    mutation PortalTestSlack {
  testSlack
}
    `) as unknown as TypedDocumentString<PortalTestSlackMutation, PortalTestSlackMutationVariables>;
export const PortalTestOpenAiDocument = new TypedDocumentString(`
    mutation PortalTestOpenAi {
  testOpenAi
}
    `) as unknown as TypedDocumentString<PortalTestOpenAiMutation, PortalTestOpenAiMutationVariables>;
export const AdminTicketsDocument = new TypedDocumentString(`
    query AdminTickets($filter: TicketFilter, $page: PageInput) {
  adminTickets(filter: $filter, page: $page) {
    total
    items {
      ...TicketRowFields
    }
  }
}
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}`) as unknown as TypedDocumentString<AdminTicketsQuery, AdminTicketsQueryVariables>;
export const AdminTicketDocument = new TypedDocumentString(`
    query AdminTicket($id: ID!) {
  supportTicket(id: $id) {
    ...TicketDetailFields
  }
}
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}
fragment TicketDetailFields on SupportTicket {
  ...TicketRowFields
  updatedAt
  messages {
    id
    author
    authorName
    body
    createdAt
  }
}`) as unknown as TypedDocumentString<AdminTicketQuery, AdminTicketQueryVariables>;
export const AdminReplyTicketDocument = new TypedDocumentString(`
    mutation AdminReplyTicket($id: ID!, $body: String!, $status: TicketStatus) {
  adminReplyTicket(id: $id, body: $body, status: $status) {
    ...TicketDetailFields
  }
}
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}
fragment TicketDetailFields on SupportTicket {
  ...TicketRowFields
  updatedAt
  messages {
    id
    author
    authorName
    body
    createdAt
  }
}`) as unknown as TypedDocumentString<AdminReplyTicketMutation, AdminReplyTicketMutationVariables>;
export const AdminUpdateTicketDocument = new TypedDocumentString(`
    mutation AdminUpdateTicket($id: ID!, $input: TicketUpdateInput!) {
  adminUpdateTicket(id: $id, input: $input) {
    ...TicketDetailFields
  }
}
    fragment TicketRowFields on SupportTicket {
  id
  subject
  category
  status
  priority
  messageCount
  lastAuthor
  user {
    id
    name
    email
  }
  appVersion
  platform
  lastMessageAt
  createdAt
}
fragment TicketDetailFields on SupportTicket {
  ...TicketRowFields
  updatedAt
  messages {
    id
    author
    authorName
    body
    createdAt
  }
}`) as unknown as TypedDocumentString<AdminUpdateTicketMutation, AdminUpdateTicketMutationVariables>;
export const AdminStatsDocument = new TypedDocumentString(`
    query AdminStats {
  adminStats {
    users
    newUsers7d
    activeUsers7d
    disabledUsers
    transactions7d
    crashes24h
    errors24h
    unresolvedErrors
    openTickets
    logsByDay {
      date
      fatal
      error
      warn
    }
    signupsByDay {
      date
      count
    }
    appVersions {
      name
      count
    }
    topErrors {
      fingerprint
      message
      level
      source
      count
      users
      lastAt
      logId
    }
  }
}
    `) as unknown as TypedDocumentString<AdminStatsQuery, AdminStatsQueryVariables>;
export const AdminUsersDocument = new TypedDocumentString(`
    query AdminUsers($filter: UserFilter, $page: PageInput) {
  adminUsers(filter: $filter, page: $page) {
    total
    items {
      ...AdminUserFields
    }
  }
}
    fragment AdminUserFields on AdminUser {
  id
  name
  email
  role
  disabled
  currency
  timezone
  locale
  appVersion
  platform
  lastSeenAt
  createdAt
  transactionCount
  errorCount
  ticketCount
}`) as unknown as TypedDocumentString<AdminUsersQuery, AdminUsersQueryVariables>;
export const AdminUserDocument = new TypedDocumentString(`
    query AdminUser($id: ID!) {
  adminUser(id: $id) {
    ...AdminUserFields
  }
}
    fragment AdminUserFields on AdminUser {
  id
  name
  email
  role
  disabled
  currency
  timezone
  locale
  appVersion
  platform
  lastSeenAt
  createdAt
  transactionCount
  errorCount
  ticketCount
}`) as unknown as TypedDocumentString<AdminUserQuery, AdminUserQueryVariables>;
export const AdminUpdateUserDocument = new TypedDocumentString(`
    mutation AdminUpdateUser($id: ID!, $input: UserUpdateInput!) {
  adminUpdateUser(id: $id, input: $input) {
    ...AdminUserFields
  }
}
    fragment AdminUserFields on AdminUser {
  id
  name
  email
  role
  disabled
  currency
  timezone
  locale
  appVersion
  platform
  lastSeenAt
  createdAt
  transactionCount
  errorCount
  ticketCount
}`) as unknown as TypedDocumentString<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>;
export const AdminResetPasswordDocument = new TypedDocumentString(`
    mutation AdminResetPassword($id: ID!, $password: String!) {
  adminResetPassword(id: $id, password: $password)
}
    `) as unknown as TypedDocumentString<AdminResetPasswordMutation, AdminResetPasswordMutationVariables>;
export const AdminDeleteUserDocument = new TypedDocumentString(`
    mutation AdminDeleteUser($id: ID!) {
  adminDeleteUser(id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteUserMutation, AdminDeleteUserMutationVariables>;