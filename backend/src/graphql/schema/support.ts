export const supportTypeDefs = /* GraphQL */ `
  enum TicketStatus {
    OPEN
    IN_PROGRESS
    RESOLVED
    CLOSED
  }

  enum TicketPriority {
    LOW
    NORMAL
    HIGH
    URGENT
  }

  enum TicketCategory {
    BUG
    QUESTION
    FEEDBACK
    ACCOUNT
    OTHER
  }

  enum TicketAuthor {
    USER
    ADMIN
  }

  type TicketMessage {
    id: ID!
    author: TicketAuthor!
    authorName: String!
    body: String!
    createdAt: DateTime!
  }

  "Help request raised from the app"
  type SupportTicket {
    id: ID!
    subject: String!
    category: TicketCategory!
    status: TicketStatus!
    priority: TicketPriority!
    messages: [TicketMessage!]!
    messageCount: Int!
    lastAuthor: TicketAuthor!
    user: UserSummary
    appVersion: String
    platform: String
    lastMessageAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TicketPage {
    items: [SupportTicket!]!
    total: Int!
  }

  input TicketInput {
    subject: String!
    category: TicketCategory!
    message: String!
  }

  input TicketFilter {
    status: TicketStatus
    priority: TicketPriority
    category: TicketCategory
    search: String
    userId: ID
  }

  input TicketUpdateInput {
    status: TicketStatus
    priority: TicketPriority
  }

  extend type Query {
    mySupportTickets: [SupportTicket!]!
    "Your own ticket (admins can open any)"
    supportTicket(id: ID!): SupportTicket
    adminTickets(filter: TicketFilter, page: PageInput): TicketPage!
  }

  extend type Mutation {
    createSupportTicket(input: TicketInput!): SupportTicket!
    replySupportTicket(id: ID!, body: String!): SupportTicket!
    adminReplyTicket(id: ID!, body: String!, status: TicketStatus): SupportTicket!
    adminUpdateTicket(id: ID!, input: TicketUpdateInput!): SupportTicket!
  }
`;
