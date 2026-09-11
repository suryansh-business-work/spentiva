import { graphql } from '@/gql';

export const MeQuery = graphql(`
  query Me {
    me {
      ...UserFields
    }
  }
`);

export const CategoriesQuery = graphql(`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`);

export const SourcesQuery = graphql(`
  query Sources {
    paymentSources {
      ...SourceFields
    }
  }
`);

export const DashboardQuery = graphql(`
  query Dashboard($month: String) {
    dashboard(month: $month) {
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
  query Report($input: ReportInput!) {
    report(input: $input) {
      ...ReportFields
    }
  }
`);

export const TransactionsQuery = graphql(`
  query Transactions($filter: TransactionFilter, $limit: Int, $offset: Int) {
    transactions(filter: $filter, limit: $limit, offset: $offset) {
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
  query ChatHistory($limit: Int, $before: DateTime) {
    chatHistory(limit: $limit, before: $before) {
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
