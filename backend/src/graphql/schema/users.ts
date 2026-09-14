export const userTypeDefs = /* GraphQL */ `
  enum UserRole {
    USER
    ADMIN
  }

  "A user as seen by admins in the portal"
  type AdminUser {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    disabled: Boolean!
    currency: String!
    timezone: String!
    locale: String!
    "Build of the app the user last used"
    appVersion: String
    platform: String
    lastSeenAt: DateTime
    createdAt: DateTime!
    transactionCount: Int!
    "FATAL + ERROR logs in the last 30 days"
    errorCount: Int!
    ticketCount: Int!
  }

  type AdminUserPage {
    items: [AdminUser!]!
    total: Int!
  }

  input UserFilter {
    search: String
    role: UserRole
    disabled: Boolean
  }

  input UserUpdateInput {
    name: String
    role: UserRole
    disabled: Boolean
  }

  "yyyy-MM-dd in the admin's time zone"
  type DayCount {
    date: String!
    count: Int!
  }

  type DayLevels {
    date: String!
    fatal: Int!
    error: Int!
    warn: Int!
  }

  type NameCount {
    name: String!
    count: Int!
  }

  type TopError {
    fingerprint: String!
    message: String!
    level: LogLevel!
    source: LogSource!
    count: Int!
    users: Int!
    lastAt: DateTime!
    logId: ID!
  }

  type AdminStats {
    users: Int!
    newUsers7d: Int!
    activeUsers7d: Int!
    disabledUsers: Int!
    transactions7d: Int!
    crashes24h: Int!
    errors24h: Int!
    unresolvedErrors: Int!
    openTickets: Int!
    logsByDay: [DayLevels!]!
    signupsByDay: [DayCount!]!
    appVersions: [NameCount!]!
    topErrors: [TopError!]!
  }

  extend type Query {
    adminStats: AdminStats!
    adminUsers(filter: UserFilter, page: PageInput): AdminUserPage!
    adminUser(id: ID!): AdminUser
  }

  extend type Mutation {
    adminUpdateUser(id: ID!, input: UserUpdateInput!): AdminUser!
    adminResetPassword(id: ID!, password: String!): Boolean!
    "Deletes the account and all of its data"
    adminDeleteUser(id: ID!): Boolean!
  }
`;
