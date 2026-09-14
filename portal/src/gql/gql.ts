/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation PortalLogin($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...MeFields\n      }\n    }\n  }\n": typeof types.PortalLoginDocument,
    "\n  query PortalMe {\n    me {\n      ...MeFields\n    }\n  }\n": typeof types.PortalMeDocument,
    "\n  mutation PortalUpdateDisplay($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...MeFields\n    }\n  }\n": typeof types.PortalUpdateDisplayDocument,
    "\n  query PortalTimeZones {\n    timeZones\n  }\n": typeof types.PortalTimeZonesDocument,
    "\n  query PortalValidationRules {\n    validationRules {\n      ...RulesFields\n    }\n  }\n": typeof types.PortalValidationRulesDocument,
    "\n  fragment MeFields on User {\n    id\n    name\n    email\n    timezone\n    locale\n    isAdmin\n  }\n": typeof types.MeFieldsFragmentDoc,
    "\n  fragment RulesFields on ValidationRules {\n    nameMax\n    passwordMin\n    passwordMax\n    ticketSubjectMin\n    ticketSubjectMax\n    ticketMessageMin\n    ticketMessageMax\n    searchMax\n  }\n": typeof types.RulesFieldsFragmentDoc,
    "\n  fragment LogRowFields on AppLog {\n    id\n    level\n    source\n    message\n    url\n    userId\n    userEmail\n    appVersion\n    platform\n    device\n    fingerprint\n    occurredAt\n    resolved\n  }\n": typeof types.LogRowFieldsFragmentDoc,
    "\n  fragment LogDetailFields on AppLog {\n    ...LogRowFields\n    stack\n    buildNumber\n    osVersion\n    apiUrl\n    context\n    ip\n    userAgent\n    createdAt\n    resolvedAt\n  }\n": typeof types.LogDetailFieldsFragmentDoc,
    "\n  fragment AdminUserFields on AdminUser {\n    id\n    name\n    email\n    role\n    disabled\n    currency\n    timezone\n    locale\n    appVersion\n    platform\n    lastSeenAt\n    createdAt\n    transactionCount\n    errorCount\n    ticketCount\n  }\n": typeof types.AdminUserFieldsFragmentDoc,
    "\n  fragment TicketRowFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    priority\n    messageCount\n    lastAuthor\n    user {\n      id\n      name\n      email\n    }\n    appVersion\n    platform\n    lastMessageAt\n    createdAt\n  }\n": typeof types.TicketRowFieldsFragmentDoc,
    "\n  fragment TicketDetailFields on SupportTicket {\n    ...TicketRowFields\n    updatedAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n": typeof types.TicketDetailFieldsFragmentDoc,
    "\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n": typeof types.EnvFieldsFragmentDoc,
    "\n  query AdminLogs($filter: LogFilter, $page: PageInput) {\n    adminLogs(filter: $filter, page: $page) {\n      total\n      items {\n        ...LogRowFields\n      }\n    }\n  }\n": typeof types.AdminLogsDocument,
    "\n  query AdminLog($id: ID!) {\n    adminLog(id: $id) {\n      ...LogDetailFields\n    }\n  }\n": typeof types.AdminLogDocument,
    "\n  query AdminLogOccurrences($fingerprint: String!) {\n    adminLogOccurrences(fingerprint: $fingerprint) {\n      count\n      users\n      firstAt\n      lastAt\n    }\n  }\n": typeof types.AdminLogOccurrencesDocument,
    "\n  mutation AdminResolveLogs($ids: [ID!], $fingerprint: String, $resolved: Boolean!) {\n    adminResolveLogs(ids: $ids, fingerprint: $fingerprint, resolved: $resolved)\n  }\n": typeof types.AdminResolveLogsDocument,
    "\n  mutation AdminDeleteLogs($ids: [ID!]!) {\n    adminDeleteLogs(ids: $ids)\n  }\n": typeof types.AdminDeleteLogsDocument,
    "\n  mutation PortalReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n": typeof types.PortalReportLogsDocument,
    "\n  query PortalEnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n": typeof types.PortalEnvVarsDocument,
    "\n  query PortalSlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n": typeof types.PortalSlackChannelsDocument,
    "\n  query PortalOpenAiModels {\n    openAiModels\n  }\n": typeof types.PortalOpenAiModelsDocument,
    "\n  mutation PortalSetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n": typeof types.PortalSetEnvVarsDocument,
    "\n  mutation PortalTestSlack {\n    testSlack\n  }\n": typeof types.PortalTestSlackDocument,
    "\n  mutation PortalTestOpenAi {\n    testOpenAi\n  }\n": typeof types.PortalTestOpenAiDocument,
    "\n  mutation PortalTestEmail {\n    testEmail\n  }\n": typeof types.PortalTestEmailDocument,
    "\n  query AdminTickets($filter: TicketFilter, $page: PageInput) {\n    adminTickets(filter: $filter, page: $page) {\n      total\n      items {\n        ...TicketRowFields\n      }\n    }\n  }\n": typeof types.AdminTicketsDocument,
    "\n  query AdminTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketDetailFields\n    }\n  }\n": typeof types.AdminTicketDocument,
    "\n  mutation AdminReplyTicket($id: ID!, $body: String!, $status: TicketStatus) {\n    adminReplyTicket(id: $id, body: $body, status: $status) {\n      ...TicketDetailFields\n    }\n  }\n": typeof types.AdminReplyTicketDocument,
    "\n  mutation AdminUpdateTicket($id: ID!, $input: TicketUpdateInput!) {\n    adminUpdateTicket(id: $id, input: $input) {\n      ...TicketDetailFields\n    }\n  }\n": typeof types.AdminUpdateTicketDocument,
    "\n  query AdminStats {\n    adminStats {\n      users\n      newUsers7d\n      activeUsers7d\n      disabledUsers\n      transactions7d\n      crashes24h\n      errors24h\n      unresolvedErrors\n      openTickets\n      logsByDay {\n        date\n        fatal\n        error\n        warn\n      }\n      signupsByDay {\n        date\n        count\n      }\n      appVersions {\n        name\n        count\n      }\n      topErrors {\n        fingerprint\n        message\n        level\n        source\n        count\n        users\n        lastAt\n        logId\n      }\n    }\n  }\n": typeof types.AdminStatsDocument,
    "\n  query AdminUsers($filter: UserFilter, $page: PageInput) {\n    adminUsers(filter: $filter, page: $page) {\n      total\n      items {\n        ...AdminUserFields\n      }\n    }\n  }\n": typeof types.AdminUsersDocument,
    "\n  query AdminUser($id: ID!) {\n    adminUser(id: $id) {\n      ...AdminUserFields\n    }\n  }\n": typeof types.AdminUserDocument,
    "\n  mutation AdminUpdateUser($id: ID!, $input: UserUpdateInput!) {\n    adminUpdateUser(id: $id, input: $input) {\n      ...AdminUserFields\n    }\n  }\n": typeof types.AdminUpdateUserDocument,
    "\n  mutation AdminResetPassword($id: ID!, $password: String!) {\n    adminResetPassword(id: $id, password: $password)\n  }\n": typeof types.AdminResetPasswordDocument,
    "\n  mutation AdminDeleteUser($id: ID!) {\n    adminDeleteUser(id: $id)\n  }\n": typeof types.AdminDeleteUserDocument,
};
const documents: Documents = {
    "\n  mutation PortalLogin($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...MeFields\n      }\n    }\n  }\n": types.PortalLoginDocument,
    "\n  query PortalMe {\n    me {\n      ...MeFields\n    }\n  }\n": types.PortalMeDocument,
    "\n  mutation PortalUpdateDisplay($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...MeFields\n    }\n  }\n": types.PortalUpdateDisplayDocument,
    "\n  query PortalTimeZones {\n    timeZones\n  }\n": types.PortalTimeZonesDocument,
    "\n  query PortalValidationRules {\n    validationRules {\n      ...RulesFields\n    }\n  }\n": types.PortalValidationRulesDocument,
    "\n  fragment MeFields on User {\n    id\n    name\n    email\n    timezone\n    locale\n    isAdmin\n  }\n": types.MeFieldsFragmentDoc,
    "\n  fragment RulesFields on ValidationRules {\n    nameMax\n    passwordMin\n    passwordMax\n    ticketSubjectMin\n    ticketSubjectMax\n    ticketMessageMin\n    ticketMessageMax\n    searchMax\n  }\n": types.RulesFieldsFragmentDoc,
    "\n  fragment LogRowFields on AppLog {\n    id\n    level\n    source\n    message\n    url\n    userId\n    userEmail\n    appVersion\n    platform\n    device\n    fingerprint\n    occurredAt\n    resolved\n  }\n": types.LogRowFieldsFragmentDoc,
    "\n  fragment LogDetailFields on AppLog {\n    ...LogRowFields\n    stack\n    buildNumber\n    osVersion\n    apiUrl\n    context\n    ip\n    userAgent\n    createdAt\n    resolvedAt\n  }\n": types.LogDetailFieldsFragmentDoc,
    "\n  fragment AdminUserFields on AdminUser {\n    id\n    name\n    email\n    role\n    disabled\n    currency\n    timezone\n    locale\n    appVersion\n    platform\n    lastSeenAt\n    createdAt\n    transactionCount\n    errorCount\n    ticketCount\n  }\n": types.AdminUserFieldsFragmentDoc,
    "\n  fragment TicketRowFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    priority\n    messageCount\n    lastAuthor\n    user {\n      id\n      name\n      email\n    }\n    appVersion\n    platform\n    lastMessageAt\n    createdAt\n  }\n": types.TicketRowFieldsFragmentDoc,
    "\n  fragment TicketDetailFields on SupportTicket {\n    ...TicketRowFields\n    updatedAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n": types.TicketDetailFieldsFragmentDoc,
    "\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n": types.EnvFieldsFragmentDoc,
    "\n  query AdminLogs($filter: LogFilter, $page: PageInput) {\n    adminLogs(filter: $filter, page: $page) {\n      total\n      items {\n        ...LogRowFields\n      }\n    }\n  }\n": types.AdminLogsDocument,
    "\n  query AdminLog($id: ID!) {\n    adminLog(id: $id) {\n      ...LogDetailFields\n    }\n  }\n": types.AdminLogDocument,
    "\n  query AdminLogOccurrences($fingerprint: String!) {\n    adminLogOccurrences(fingerprint: $fingerprint) {\n      count\n      users\n      firstAt\n      lastAt\n    }\n  }\n": types.AdminLogOccurrencesDocument,
    "\n  mutation AdminResolveLogs($ids: [ID!], $fingerprint: String, $resolved: Boolean!) {\n    adminResolveLogs(ids: $ids, fingerprint: $fingerprint, resolved: $resolved)\n  }\n": types.AdminResolveLogsDocument,
    "\n  mutation AdminDeleteLogs($ids: [ID!]!) {\n    adminDeleteLogs(ids: $ids)\n  }\n": types.AdminDeleteLogsDocument,
    "\n  mutation PortalReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n": types.PortalReportLogsDocument,
    "\n  query PortalEnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n": types.PortalEnvVarsDocument,
    "\n  query PortalSlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n": types.PortalSlackChannelsDocument,
    "\n  query PortalOpenAiModels {\n    openAiModels\n  }\n": types.PortalOpenAiModelsDocument,
    "\n  mutation PortalSetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n": types.PortalSetEnvVarsDocument,
    "\n  mutation PortalTestSlack {\n    testSlack\n  }\n": types.PortalTestSlackDocument,
    "\n  mutation PortalTestOpenAi {\n    testOpenAi\n  }\n": types.PortalTestOpenAiDocument,
    "\n  mutation PortalTestEmail {\n    testEmail\n  }\n": types.PortalTestEmailDocument,
    "\n  query AdminTickets($filter: TicketFilter, $page: PageInput) {\n    adminTickets(filter: $filter, page: $page) {\n      total\n      items {\n        ...TicketRowFields\n      }\n    }\n  }\n": types.AdminTicketsDocument,
    "\n  query AdminTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketDetailFields\n    }\n  }\n": types.AdminTicketDocument,
    "\n  mutation AdminReplyTicket($id: ID!, $body: String!, $status: TicketStatus) {\n    adminReplyTicket(id: $id, body: $body, status: $status) {\n      ...TicketDetailFields\n    }\n  }\n": types.AdminReplyTicketDocument,
    "\n  mutation AdminUpdateTicket($id: ID!, $input: TicketUpdateInput!) {\n    adminUpdateTicket(id: $id, input: $input) {\n      ...TicketDetailFields\n    }\n  }\n": types.AdminUpdateTicketDocument,
    "\n  query AdminStats {\n    adminStats {\n      users\n      newUsers7d\n      activeUsers7d\n      disabledUsers\n      transactions7d\n      crashes24h\n      errors24h\n      unresolvedErrors\n      openTickets\n      logsByDay {\n        date\n        fatal\n        error\n        warn\n      }\n      signupsByDay {\n        date\n        count\n      }\n      appVersions {\n        name\n        count\n      }\n      topErrors {\n        fingerprint\n        message\n        level\n        source\n        count\n        users\n        lastAt\n        logId\n      }\n    }\n  }\n": types.AdminStatsDocument,
    "\n  query AdminUsers($filter: UserFilter, $page: PageInput) {\n    adminUsers(filter: $filter, page: $page) {\n      total\n      items {\n        ...AdminUserFields\n      }\n    }\n  }\n": types.AdminUsersDocument,
    "\n  query AdminUser($id: ID!) {\n    adminUser(id: $id) {\n      ...AdminUserFields\n    }\n  }\n": types.AdminUserDocument,
    "\n  mutation AdminUpdateUser($id: ID!, $input: UserUpdateInput!) {\n    adminUpdateUser(id: $id, input: $input) {\n      ...AdminUserFields\n    }\n  }\n": types.AdminUpdateUserDocument,
    "\n  mutation AdminResetPassword($id: ID!, $password: String!) {\n    adminResetPassword(id: $id, password: $password)\n  }\n": types.AdminResetPasswordDocument,
    "\n  mutation AdminDeleteUser($id: ID!) {\n    adminDeleteUser(id: $id)\n  }\n": types.AdminDeleteUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalLogin($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...MeFields\n      }\n    }\n  }\n"): typeof import('./graphql').PortalLoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalMe {\n    me {\n      ...MeFields\n    }\n  }\n"): typeof import('./graphql').PortalMeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalUpdateDisplay($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...MeFields\n    }\n  }\n"): typeof import('./graphql').PortalUpdateDisplayDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalTimeZones {\n    timeZones\n  }\n"): typeof import('./graphql').PortalTimeZonesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalValidationRules {\n    validationRules {\n      ...RulesFields\n    }\n  }\n"): typeof import('./graphql').PortalValidationRulesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MeFields on User {\n    id\n    name\n    email\n    timezone\n    locale\n    isAdmin\n  }\n"): typeof import('./graphql').MeFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RulesFields on ValidationRules {\n    nameMax\n    passwordMin\n    passwordMax\n    ticketSubjectMin\n    ticketSubjectMax\n    ticketMessageMin\n    ticketMessageMax\n    searchMax\n  }\n"): typeof import('./graphql').RulesFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LogRowFields on AppLog {\n    id\n    level\n    source\n    message\n    url\n    userId\n    userEmail\n    appVersion\n    platform\n    device\n    fingerprint\n    occurredAt\n    resolved\n  }\n"): typeof import('./graphql').LogRowFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LogDetailFields on AppLog {\n    ...LogRowFields\n    stack\n    buildNumber\n    osVersion\n    apiUrl\n    context\n    ip\n    userAgent\n    createdAt\n    resolvedAt\n  }\n"): typeof import('./graphql').LogDetailFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminUserFields on AdminUser {\n    id\n    name\n    email\n    role\n    disabled\n    currency\n    timezone\n    locale\n    appVersion\n    platform\n    lastSeenAt\n    createdAt\n    transactionCount\n    errorCount\n    ticketCount\n  }\n"): typeof import('./graphql').AdminUserFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TicketRowFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    priority\n    messageCount\n    lastAuthor\n    user {\n      id\n      name\n      email\n    }\n    appVersion\n    platform\n    lastMessageAt\n    createdAt\n  }\n"): typeof import('./graphql').TicketRowFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TicketDetailFields on SupportTicket {\n    ...TicketRowFields\n    updatedAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n"): typeof import('./graphql').TicketDetailFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n"): typeof import('./graphql').EnvFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminLogs($filter: LogFilter, $page: PageInput) {\n    adminLogs(filter: $filter, page: $page) {\n      total\n      items {\n        ...LogRowFields\n      }\n    }\n  }\n"): typeof import('./graphql').AdminLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminLog($id: ID!) {\n    adminLog(id: $id) {\n      ...LogDetailFields\n    }\n  }\n"): typeof import('./graphql').AdminLogDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminLogOccurrences($fingerprint: String!) {\n    adminLogOccurrences(fingerprint: $fingerprint) {\n      count\n      users\n      firstAt\n      lastAt\n    }\n  }\n"): typeof import('./graphql').AdminLogOccurrencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminResolveLogs($ids: [ID!], $fingerprint: String, $resolved: Boolean!) {\n    adminResolveLogs(ids: $ids, fingerprint: $fingerprint, resolved: $resolved)\n  }\n"): typeof import('./graphql').AdminResolveLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteLogs($ids: [ID!]!) {\n    adminDeleteLogs(ids: $ids)\n  }\n"): typeof import('./graphql').AdminDeleteLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n"): typeof import('./graphql').PortalReportLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalEnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n"): typeof import('./graphql').PortalEnvVarsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalSlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n"): typeof import('./graphql').PortalSlackChannelsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PortalOpenAiModels {\n    openAiModels\n  }\n"): typeof import('./graphql').PortalOpenAiModelsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalSetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n"): typeof import('./graphql').PortalSetEnvVarsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalTestSlack {\n    testSlack\n  }\n"): typeof import('./graphql').PortalTestSlackDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalTestOpenAi {\n    testOpenAi\n  }\n"): typeof import('./graphql').PortalTestOpenAiDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PortalTestEmail {\n    testEmail\n  }\n"): typeof import('./graphql').PortalTestEmailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminTickets($filter: TicketFilter, $page: PageInput) {\n    adminTickets(filter: $filter, page: $page) {\n      total\n      items {\n        ...TicketRowFields\n      }\n    }\n  }\n"): typeof import('./graphql').AdminTicketsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketDetailFields\n    }\n  }\n"): typeof import('./graphql').AdminTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminReplyTicket($id: ID!, $body: String!, $status: TicketStatus) {\n    adminReplyTicket(id: $id, body: $body, status: $status) {\n      ...TicketDetailFields\n    }\n  }\n"): typeof import('./graphql').AdminReplyTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminUpdateTicket($id: ID!, $input: TicketUpdateInput!) {\n    adminUpdateTicket(id: $id, input: $input) {\n      ...TicketDetailFields\n    }\n  }\n"): typeof import('./graphql').AdminUpdateTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminStats {\n    adminStats {\n      users\n      newUsers7d\n      activeUsers7d\n      disabledUsers\n      transactions7d\n      crashes24h\n      errors24h\n      unresolvedErrors\n      openTickets\n      logsByDay {\n        date\n        fatal\n        error\n        warn\n      }\n      signupsByDay {\n        date\n        count\n      }\n      appVersions {\n        name\n        count\n      }\n      topErrors {\n        fingerprint\n        message\n        level\n        source\n        count\n        users\n        lastAt\n        logId\n      }\n    }\n  }\n"): typeof import('./graphql').AdminStatsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminUsers($filter: UserFilter, $page: PageInput) {\n    adminUsers(filter: $filter, page: $page) {\n      total\n      items {\n        ...AdminUserFields\n      }\n    }\n  }\n"): typeof import('./graphql').AdminUsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminUser($id: ID!) {\n    adminUser(id: $id) {\n      ...AdminUserFields\n    }\n  }\n"): typeof import('./graphql').AdminUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminUpdateUser($id: ID!, $input: UserUpdateInput!) {\n    adminUpdateUser(id: $id, input: $input) {\n      ...AdminUserFields\n    }\n  }\n"): typeof import('./graphql').AdminUpdateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminResetPassword($id: ID!, $password: String!) {\n    adminResetPassword(id: $id, password: $password)\n  }\n"): typeof import('./graphql').AdminResetPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteUser($id: ID!) {\n    adminDeleteUser(id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteUserDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
