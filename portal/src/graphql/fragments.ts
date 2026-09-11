import { graphql } from '@/gql';

export const MeFields = graphql(`
  fragment MeFields on User {
    id
    name
    email
    timezone
    locale
    isAdmin
  }
`);

export const RulesFields = graphql(`
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
`);

export const LogRowFields = graphql(`
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
`);

export const LogDetailFields = graphql(`
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
`);

export const AdminUserFields = graphql(`
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
`);

export const TicketRowFields = graphql(`
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
`);

export const TicketDetailFields = graphql(`
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
`);

export const EnvFields = graphql(`
  fragment EnvFields on EnvVar {
    key
    label
    group
    secret
    isSet
    value
    source
  }
`);
