import { graphql } from '@/gql';

export const TicketFields = graphql(`
  fragment TicketFields on SupportTicket {
    id
    subject
    category
    status
    messageCount
    lastAuthor
    lastMessageAt
    createdAt
    messages {
      id
      author
      authorName
      body
      createdAt
    }
  }
`);

export const MyTicketsQuery = graphql(`
  query MySupportTickets {
    mySupportTickets {
      ...TicketFields
    }
  }
`);

export const TicketQuery = graphql(`
  query SupportTicket($id: ID!) {
    supportTicket(id: $id) {
      ...TicketFields
    }
  }
`);

export const CreateTicketMutation = graphql(`
  mutation CreateSupportTicket($input: TicketInput!) {
    createSupportTicket(input: $input) {
      ...TicketFields
    }
  }
`);

export const ReplyTicketMutation = graphql(`
  mutation ReplySupportTicket($id: ID!, $body: String!) {
    replySupportTicket(id: $id, body: $body) {
      ...TicketFields
    }
  }
`);

export const ValidationRulesQuery = graphql(`
  query ValidationRules {
    validationRules {
      nameMax
      passwordMin
      passwordMax
      ticketSubjectMin
      ticketSubjectMax
      ticketMessageMin
      ticketMessageMax
    }
  }
`);

/** Crash / error reports (see lib/crash) */
export const ReportLogsMutation = graphql(`
  mutation ReportLogs($input: [ClientLogInput!]!) {
    reportLogs(input: $input)
  }
`);
