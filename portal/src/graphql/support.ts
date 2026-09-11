import { graphql } from '@/gql';

export const AdminTicketsQuery = graphql(`
  query AdminTickets($filter: TicketFilter, $page: PageInput) {
    adminTickets(filter: $filter, page: $page) {
      total
      items {
        ...TicketRowFields
      }
    }
  }
`);

export const TicketQuery = graphql(`
  query AdminTicket($id: ID!) {
    supportTicket(id: $id) {
      ...TicketDetailFields
    }
  }
`);

export const ReplyTicketMutation = graphql(`
  mutation AdminReplyTicket($id: ID!, $body: String!, $status: TicketStatus) {
    adminReplyTicket(id: $id, body: $body, status: $status) {
      ...TicketDetailFields
    }
  }
`);

export const UpdateTicketMutation = graphql(`
  mutation AdminUpdateTicket($id: ID!, $input: TicketUpdateInput!) {
    adminUpdateTicket(id: $id, input: $input) {
      ...TicketDetailFields
    }
  }
`);
