import { graphql } from '@/gql';

export const MeQuery = graphql(`
  query Me {
    me {
      ...UserFields
    }
  }
`);

export const CategoriesQuery = graphql(`
  query Categories($trackerId: ID) {
    categories(trackerId: $trackerId) {
      ...CategoryFields
    }
  }
`);

export const SourcesQuery = graphql(`
  query Sources($trackerId: ID) {
    paymentSources(trackerId: $trackerId) {
      ...SourceFields
    }
  }
`);

export const DashboardQuery = graphql(`
  query Dashboard($trackerId: ID, $month: String) {
    dashboard(trackerId: $trackerId, month: $month) {
      from
      to
      currency
      income
      expense
      savings
      savingsRate
      expenseRatio
      budget
      remaining
      daysLeft
      dailyAllowance
      avgDailyExpense
      transactionCount
      previousExpense
      expenseChange
      insight
      topCategory {
        ...SliceFields
      }
      categories {
        ...SliceFields
      }
      trend {
        ...ReportFields
      }
      recent {
        ...TxFields
      }
    }
  }
`);

export const ReportQuery = graphql(`
  query Report($trackerId: ID, $input: ReportInput!) {
    report(trackerId: $trackerId, input: $input) {
      ...ReportFields
    }
  }
`);

export const TransactionsQuery = graphql(`
  query Transactions($trackerId: ID, $filter: TransactionFilter, $limit: Int, $offset: Int) {
    transactions(trackerId: $trackerId, filter: $filter, limit: $limit, offset: $offset) {
      items {
        ...TxFields
      }
      total
      hasMore
    }
  }
`);

export const TransactionQuery = graphql(`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      ...TxFields
    }
  }
`);

export const ChatHistoryQuery = graphql(`
  query ChatHistory($trackerId: ID, $limit: Int, $before: DateTime) {
    chatHistory(trackerId: $trackerId, limit: $limit, before: $before) {
      ...ChatFields
    }
  }
`);

export const ReferenceQuery = graphql(`
  query Reference {
    chatSuggestions
    currencies {
      code
      name
    }
    timeZones
  }
`);

export const EnvVarsQuery = graphql(`
  query EnvVars {
    envVars {
      ...EnvFields
    }
  }
`);

export const SlackChannelsQuery = graphql(`
  query SlackChannels {
    slackChannels {
      id
      name
      isPrivate
      isMember
    }
  }
`);

export const OpenAiModelsQuery = graphql(`
  query OpenAiModels {
    openAiModels
  }
`);
