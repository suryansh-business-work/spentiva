import { graphql } from '@/gql';

export const UserFields = graphql(`
  fragment UserFields on User {
    id
    name
    email
    currency
    timezone
    locale
    monthlyBudget
    isAdmin
    createdAt
  }
`);

export const CategoryFields = graphql(`
  fragment CategoryFields on Category {
    id
    name
    type
    icon
    color
    items {
      id
      name
    }
  }
`);

export const SourceFields = graphql(`
  fragment SourceFields on PaymentSource {
    id
    name
    icon
    isDefault
  }
`);

export const TxFields = graphql(`
  fragment TxFields on Transaction {
    id
    type
    amount
    currency
    amountBase
    baseCurrency
    fxRate
    categoryId
    categoryName
    expenseOnId
    expenseOnName
    sourceId
    sourceName
    note
    occurredAt
    via
    createdAt
  }
`);

export const ReportFields = graphql(`
  fragment ReportFields on Report {
    kind
    title
    subtitle
    chartType
    labels
    datasets {
      label
      data
      color
      colors
    }
    stats {
      label
      value
      format
      hint
    }
    currency
    from
    to
    empty
  }
`);

export const SliceFields = graphql(`
  fragment SliceFields on CategorySlice {
    categoryId
    name
    color
    icon
    amount
    count
    percent
  }
`);

export const ChatFields = graphql(`
  fragment ChatFields on ChatMessage {
    id
    role
    kind
    text
    transaction {
      ...TxFields
    }
    options {
      id
      label
      action
      value
    }
    selectedOptionId
    resolved
    report {
      ...ReportFields
    }
    createdAt
  }
`);

export const EnvFields = graphql(`
  fragment EnvFields on EnvVar {
    key
    label
    group
    secret
    isSet
    value
    source
  }
`);
