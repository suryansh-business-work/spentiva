export const logTypeDefs = /* GraphQL */ `
  enum LogLevel {
    FATAL
    ERROR
    WARN
    INFO
  }

  enum LogSource {
    APP
    PORTAL
    API
  }

  "A crash / error report from the app, the portal or the API"
  type AppLog {
    id: ID!
    level: LogLevel!
    source: LogSource!
    message: String!
    stack: String
    "App screen route, portal page URL or API operation"
    url: String
    userId: ID
    userEmail: String
    appVersion: String
    buildNumber: String
    "android | ios | web | server"
    platform: String
    osVersion: String
    device: String
    apiUrl: String
    "JSON text"
    context: String
    ip: String
    userAgent: String
    "Same error = same fingerprint"
    fingerprint: String!
    occurredAt: DateTime!
    createdAt: DateTime!
    resolved: Boolean!
    resolvedAt: DateTime
  }

  type AppLogPage {
    items: [AppLog!]!
    total: Int!
  }

  type LogOccurrences {
    count: Int!
    users: Int!
    firstAt: DateTime!
    lastAt: DateTime!
  }

  input ClientLogInput {
    level: LogLevel!
    "APP or PORTAL"
    source: LogSource!
    message: String!
    stack: String
    url: String
    appVersion: String
    buildNumber: String
    platform: String
    osVersion: String
    device: String
    apiUrl: String
    context: String
    occurredAt: DateTime
  }

  input LogFilter {
    levels: [LogLevel!]
    source: LogSource
    resolved: Boolean
    search: String
    userId: ID
    fingerprint: String
    appVersion: String
    platform: String
    from: DateTime
    to: DateTime
  }

  extend type Query {
    adminLogs(filter: LogFilter, page: PageInput): AppLogPage!
    adminLog(id: ID!): AppLog
    adminLogOccurrences(fingerprint: String!): LogOccurrences
  }

  extend type Mutation {
    "Crash / error reports (no login needed; attributed to the signed-in user when there is one)"
    reportLogs(input: [ClientLogInput!]!): Int!
    "Resolve or reopen logs by id, or every log with the same fingerprint"
    adminResolveLogs(ids: [ID!], fingerprint: String, resolved: Boolean!): Int!
    adminDeleteLogs(ids: [ID!]!): Int!
  }
`;
