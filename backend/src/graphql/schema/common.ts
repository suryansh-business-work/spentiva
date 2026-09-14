export const commonTypeDefs = /* GraphQL */ `
  enum SortDirection {
    ASC
    DESC
  }

  "Portal table paging (page is 0-based)"
  input PageInput {
    page: Int
    pageSize: Int
    sortBy: String
    sortDir: SortDirection
  }

  type UserSummary {
    id: ID!
    name: String!
    email: String!
  }

  "Form limits the API enforces; the app and portal build their zod schemas from these"
  type ValidationRules {
    nameMax: Int!
    passwordMin: Int!
    passwordMax: Int!
    ticketSubjectMin: Int!
    ticketSubjectMax: Int!
    ticketMessageMin: Int!
    ticketMessageMax: Int!
    searchMax: Int!
  }

  extend type Query {
    validationRules: ValidationRules!
  }
`;
