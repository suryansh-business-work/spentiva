import { graphql } from '@/gql';

export const AdminStatsQuery = graphql(`
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
`);

export const AdminUsersQuery = graphql(`
  query AdminUsers($filter: UserFilter, $page: PageInput) {
    adminUsers(filter: $filter, page: $page) {
      total
      items {
        ...AdminUserFields
      }
    }
  }
`);

export const AdminUserQuery = graphql(`
  query AdminUser($id: ID!) {
    adminUser(id: $id) {
      ...AdminUserFields
    }
  }
`);

export const UpdateUserMutation = graphql(`
  mutation AdminUpdateUser($id: ID!, $input: UserUpdateInput!) {
    adminUpdateUser(id: $id, input: $input) {
      ...AdminUserFields
    }
  }
`);

export const ResetPasswordMutation = graphql(`
  mutation AdminResetPassword($id: ID!, $password: String!) {
    adminResetPassword(id: $id, password: $password)
  }
`);

export const DeleteUserMutation = graphql(`
  mutation AdminDeleteUser($id: ID!) {
    adminDeleteUser(id: $id)
  }
`);
