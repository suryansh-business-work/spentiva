import { graphql } from '@/gql';

export const AdminLogsQuery = graphql(`
  query AdminLogs($filter: LogFilter, $page: PageInput) {
    adminLogs(filter: $filter, page: $page) {
      total
      items {
        ...LogRowFields
      }
    }
  }
`);

export const AdminLogQuery = graphql(`
  query AdminLog($id: ID!) {
    adminLog(id: $id) {
      ...LogDetailFields
    }
  }
`);

export const LogOccurrencesQuery = graphql(`
  query AdminLogOccurrences($fingerprint: String!) {
    adminLogOccurrences(fingerprint: $fingerprint) {
      count
      users
      firstAt
      lastAt
    }
  }
`);

export const ResolveLogsMutation = graphql(`
  mutation AdminResolveLogs($ids: [ID!], $fingerprint: String, $resolved: Boolean!) {
    adminResolveLogs(ids: $ids, fingerprint: $fingerprint, resolved: $resolved)
  }
`);

export const DeleteLogsMutation = graphql(`
  mutation AdminDeleteLogs($ids: [ID!]!) {
    adminDeleteLogs(ids: $ids)
  }
`);

export const ReportLogsMutation = graphql(`
  mutation PortalReportLogs($input: [ClientLogInput!]!) {
    reportLogs(input: $input)
  }
`);
