/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type CategoryInput = {
  color?: string | null | undefined;
  icon?: string | null | undefined;
  items?: Array<string> | null | undefined;
  name: string;
  type: TxType;
};

export type CategoryUpdateInput = {
  color?: string | null | undefined;
  icon?: string | null | undefined;
  name?: string | null | undefined;
};

export type ChartType = 'bar' | 'barH' | 'doughnut' | 'line' | 'pie';

export type ChatKind = 'ERROR' | 'OPTIONS' | 'REPORT' | 'TEXT' | 'TRANSACTION';

export type ChatRole = 'ASSISTANT' | 'USER';

export type EnvSource = 'APP' | 'NONE' | 'SERVER_ENV';

export type EnvVarInput = {
  key: string;
  /** Empty or null clears the value */
  value?: string | null | undefined;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type PaymentSourceInput = {
  icon?: string | null | undefined;
  isDefault?: boolean | null | undefined;
  name: string;
};

export type Period =
  | 'ALL_TIME'
  | 'LAST_6_MONTHS'
  | 'LAST_7_DAYS'
  | 'LAST_12_MONTHS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'LAST_MONTH'
  | 'LAST_WEEK'
  | 'LAST_YEAR'
  | 'THIS_MONTH'
  | 'THIS_WEEK'
  | 'THIS_YEAR'
  | 'TODAY'
  | 'YESTERDAY';

export type ProfileInput = {
  currency?: string | null | undefined;
  locale?: string | null | undefined;
  monthlyBudget?: number | null | undefined;
  name?: string | null | undefined;
  timezone?: string | null | undefined;
};

export type ReportInput = {
  categoryId?: string | number | null | undefined;
  from?: string | null | undefined;
  kind: ReportKind;
  limit?: number | null | undefined;
  /** YYYY-MM calendar month in the user's time zone (takes precedence over period) */
  month?: string | null | undefined;
  period?: Period | null | undefined;
  to?: string | null | undefined;
  type?: TxType | null | undefined;
};

export type ReportKind = 'AVERAGE' | 'CATEGORY' | 'DAILY' | 'EXPENSE_ON' | 'INCOME_VS_EXPENSE' | 'MONTHLY' | 'SOURCE' | 'TOP';

export type SignupInput = {
  currency?: string | null | undefined;
  email: string;
  locale?: string | null | undefined;
  name: string;
  password: string;
  timezone?: string | null | undefined;
};

export type StatFormat = 'CURRENCY' | 'NUMBER' | 'PERCENT';

export type TransactionFilter = {
  categoryId?: string | number | null | undefined;
  from?: string | null | undefined;
  /** YYYY-MM calendar month in the user's time zone */
  month?: string | null | undefined;
  search?: string | null | undefined;
  sourceId?: string | number | null | undefined;
  to?: string | null | undefined;
  type?: TxType | null | undefined;
};

export type TransactionInput = {
  amount: number;
  categoryId: string | number;
  /** ISO 4217, defaults to the user's currency */
  currency?: string | null | undefined;
  expenseOnId?: string | number | null | undefined;
  note?: string | null | undefined;
  occurredAt?: string | null | undefined;
  sourceId?: string | number | null | undefined;
  type: TxType;
};

export type TxType = 'EXPENSE' | 'INCOME';

/** Where a transaction came from */
export type TxVia = 'CHAT' | 'MANUAL';

export type UserFieldsFragment = {
  id: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  locale: string;
  monthlyBudget: number | null;
  isAdmin: boolean;
  createdAt: string;
};

export type CategoryFieldsFragment = {
  id: string;
  name: string;
  type: TxType;
  icon: string;
  color: string;
  items: Array<{ id: string; name: string }>;
};

export type SourceFieldsFragment = { id: string; name: string; icon: string; isDefault: boolean };

export type TxFieldsFragment = {
  id: string;
  type: TxType;
  amount: number;
  currency: string;
  amountBase: number;
  baseCurrency: string;
  fxRate: number;
  categoryId: string | null;
  categoryName: string;
  expenseOnId: string | null;
  expenseOnName: string | null;
  sourceId: string | null;
  sourceName: string | null;
  note: string | null;
  occurredAt: string;
  via: TxVia;
  createdAt: string;
};

export type ReportFieldsFragment = {
  kind: ReportKind;
  title: string;
  subtitle: string;
  chartType: ChartType;
  labels: Array<string>;
  currency: string;
  from: string;
  to: string;
  empty: boolean;
  datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
  stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
};

export type SliceFieldsFragment = {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string;
  amount: number;
  count: number;
  percent: number;
};

export type ChatFieldsFragment = {
  id: string;
  role: ChatRole;
  kind: ChatKind;
  text: string;
  selectedOptionId: string | null;
  resolved: boolean;
  createdAt: string;
  transaction: {
    id: string;
    type: TxType;
    amount: number;
    currency: string;
    amountBase: number;
    baseCurrency: string;
    fxRate: number;
    categoryId: string | null;
    categoryName: string;
    expenseOnId: string | null;
    expenseOnName: string | null;
    sourceId: string | null;
    sourceName: string | null;
    note: string | null;
    occurredAt: string;
    via: TxVia;
    createdAt: string;
  } | null;
  options: Array<{ id: string; label: string; action: string; value: string | null }>;
  report: {
    kind: ReportKind;
    title: string;
    subtitle: string;
    chartType: ChartType;
    labels: Array<string>;
    currency: string;
    from: string;
    to: string;
    empty: boolean;
    datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
    stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
  } | null;
};

export type EnvFieldsFragment = {
  key: string;
  label: string;
  group: string;
  secret: boolean;
  isSet: boolean;
  value: string | null;
  source: EnvSource;
};

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;

export type SignupMutation = {
  signup: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      currency: string;
      timezone: string;
      locale: string;
      monthlyBudget: number | null;
      isAdmin: boolean;
      createdAt: string;
    };
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      currency: string;
      timezone: string;
      locale: string;
      monthlyBudget: number | null;
      isAdmin: boolean;
      createdAt: string;
    };
  };
};

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileInput;
}>;

export type UpdateProfileMutation = {
  updateProfile: {
    id: string;
    name: string;
    email: string;
    currency: string;
    timezone: string;
    locale: string;
    monthlyBudget: number | null;
    isAdmin: boolean;
    createdAt: string;
  };
};

export type ChangePasswordMutationVariables = Exact<{
  current: string;
  next: string;
}>;

export type ChangePasswordMutation = { changePassword: boolean };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryInput;
}>;

export type CreateCategoryMutation = {
  createCategory: { id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> };
};

export type UpdateCategoryMutationVariables = Exact<{
  id: string | number;
  input: CategoryUpdateInput;
}>;

export type UpdateCategoryMutation = {
  updateCategory: { id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> };
};

export type DeleteCategoryMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteCategoryMutation = { deleteCategory: boolean };

export type AddExpenseOnMutationVariables = Exact<{
  categoryId: string | number;
  name: string;
}>;

export type AddExpenseOnMutation = {
  addExpenseOn: { id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> };
};

export type RenameExpenseOnMutationVariables = Exact<{
  categoryId: string | number;
  itemId: string | number;
  name: string;
}>;

export type RenameExpenseOnMutation = {
  renameExpenseOn: { id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> };
};

export type RemoveExpenseOnMutationVariables = Exact<{
  categoryId: string | number;
  itemId: string | number;
}>;

export type RemoveExpenseOnMutation = {
  removeExpenseOn: { id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> };
};

export type CreateSourceMutationVariables = Exact<{
  input: PaymentSourceInput;
}>;

export type CreateSourceMutation = { createPaymentSource: { id: string; name: string; icon: string; isDefault: boolean } };

export type UpdateSourceMutationVariables = Exact<{
  id: string | number;
  input: PaymentSourceInput;
}>;

export type UpdateSourceMutation = { updatePaymentSource: { id: string; name: string; icon: string; isDefault: boolean } };

export type DeleteSourceMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteSourceMutation = { deletePaymentSource: boolean };

export type CreateTxMutationVariables = Exact<{
  input: TransactionInput;
}>;

export type CreateTxMutation = {
  createTransaction: {
    id: string;
    type: TxType;
    amount: number;
    currency: string;
    amountBase: number;
    baseCurrency: string;
    fxRate: number;
    categoryId: string | null;
    categoryName: string;
    expenseOnId: string | null;
    expenseOnName: string | null;
    sourceId: string | null;
    sourceName: string | null;
    note: string | null;
    occurredAt: string;
    via: TxVia;
    createdAt: string;
  };
};

export type UpdateTxMutationVariables = Exact<{
  id: string | number;
  input: TransactionInput;
}>;

export type UpdateTxMutation = {
  updateTransaction: {
    id: string;
    type: TxType;
    amount: number;
    currency: string;
    amountBase: number;
    baseCurrency: string;
    fxRate: number;
    categoryId: string | null;
    categoryName: string;
    expenseOnId: string | null;
    expenseOnName: string | null;
    sourceId: string | null;
    sourceName: string | null;
    note: string | null;
    occurredAt: string;
    via: TxVia;
    createdAt: string;
  };
};

export type DeleteTxMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteTxMutation = { deleteTransaction: boolean };

export type SendChatMutationVariables = Exact<{
  text: string;
}>;

export type SendChatMutation = {
  sendChatMessage: Array<{
    id: string;
    role: ChatRole;
    kind: ChatKind;
    text: string;
    selectedOptionId: string | null;
    resolved: boolean;
    createdAt: string;
    transaction: {
      id: string;
      type: TxType;
      amount: number;
      currency: string;
      amountBase: number;
      baseCurrency: string;
      fxRate: number;
      categoryId: string | null;
      categoryName: string;
      expenseOnId: string | null;
      expenseOnName: string | null;
      sourceId: string | null;
      sourceName: string | null;
      note: string | null;
      occurredAt: string;
      via: TxVia;
      createdAt: string;
    } | null;
    options: Array<{ id: string; label: string; action: string; value: string | null }>;
    report: {
      kind: ReportKind;
      title: string;
      subtitle: string;
      chartType: ChartType;
      labels: Array<string>;
      currency: string;
      from: string;
      to: string;
      empty: boolean;
      datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
      stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
    } | null;
  }>;
};

export type ChooseOptionMutationVariables = Exact<{
  messageId: string | number;
  optionId: string | number;
}>;

export type ChooseOptionMutation = {
  chooseChatOption: Array<{
    id: string;
    role: ChatRole;
    kind: ChatKind;
    text: string;
    selectedOptionId: string | null;
    resolved: boolean;
    createdAt: string;
    transaction: {
      id: string;
      type: TxType;
      amount: number;
      currency: string;
      amountBase: number;
      baseCurrency: string;
      fxRate: number;
      categoryId: string | null;
      categoryName: string;
      expenseOnId: string | null;
      expenseOnName: string | null;
      sourceId: string | null;
      sourceName: string | null;
      note: string | null;
      occurredAt: string;
      via: TxVia;
      createdAt: string;
    } | null;
    options: Array<{ id: string; label: string; action: string; value: string | null }>;
    report: {
      kind: ReportKind;
      title: string;
      subtitle: string;
      chartType: ChartType;
      labels: Array<string>;
      currency: string;
      from: string;
      to: string;
      empty: boolean;
      datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
      stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
    } | null;
  }>;
};

export type ClearChatMutationVariables = Exact<{ [key: string]: never }>;

export type ClearChatMutation = { clearChat: boolean };

export type SetEnvVarsMutationVariables = Exact<{
  input: Array<EnvVarInput> | EnvVarInput;
}>;

export type SetEnvVarsMutation = {
  setEnvVars: Array<{ key: string; label: string; group: string; secret: boolean; isSet: boolean; value: string | null; source: EnvSource }>;
};

export type TestSlackMutationVariables = Exact<{ [key: string]: never }>;

export type TestSlackMutation = { testSlack: boolean };

export type TestOpenAiMutationVariables = Exact<{ [key: string]: never }>;

export type TestOpenAiMutation = { testOpenAi: string };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: {
    id: string;
    name: string;
    email: string;
    currency: string;
    timezone: string;
    locale: string;
    monthlyBudget: number | null;
    isAdmin: boolean;
    createdAt: string;
  } | null;
};

export type CategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type CategoriesQuery = {
  categories: Array<{ id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> }>;
};

export type SourcesQueryVariables = Exact<{ [key: string]: never }>;

export type SourcesQuery = { paymentSources: Array<{ id: string; name: string; icon: string; isDefault: boolean }> };

export type DashboardQueryVariables = Exact<{
  month?: string | null | undefined;
}>;

export type DashboardQuery = {
  dashboard: {
    from: string;
    to: string;
    currency: string;
    income: number;
    expense: number;
    savings: number;
    savingsRate: number;
    expenseRatio: number;
    budget: number | null;
    remaining: number;
    daysLeft: number;
    dailyAllowance: number;
    avgDailyExpense: number;
    transactionCount: number;
    previousExpense: number;
    expenseChange: number | null;
    insight: string;
    topCategory: { categoryId: string | null; name: string; color: string; icon: string; amount: number; count: number; percent: number } | null;
    categories: Array<{ categoryId: string | null; name: string; color: string; icon: string; amount: number; count: number; percent: number }>;
    trend: {
      kind: ReportKind;
      title: string;
      subtitle: string;
      chartType: ChartType;
      labels: Array<string>;
      currency: string;
      from: string;
      to: string;
      empty: boolean;
      datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
      stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
    };
    recent: Array<{
      id: string;
      type: TxType;
      amount: number;
      currency: string;
      amountBase: number;
      baseCurrency: string;
      fxRate: number;
      categoryId: string | null;
      categoryName: string;
      expenseOnId: string | null;
      expenseOnName: string | null;
      sourceId: string | null;
      sourceName: string | null;
      note: string | null;
      occurredAt: string;
      via: TxVia;
      createdAt: string;
    }>;
  };
};

export type ReportQueryVariables = Exact<{
  input: ReportInput;
}>;

export type ReportQuery = {
  report: {
    kind: ReportKind;
    title: string;
    subtitle: string;
    chartType: ChartType;
    labels: Array<string>;
    currency: string;
    from: string;
    to: string;
    empty: boolean;
    datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
    stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
  };
};

export type TransactionsQueryVariables = Exact<{
  filter?: TransactionFilter | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;

export type TransactionsQuery = {
  transactions: {
    total: number;
    hasMore: boolean;
    items: Array<{
      id: string;
      type: TxType;
      amount: number;
      currency: string;
      amountBase: number;
      baseCurrency: string;
      fxRate: number;
      categoryId: string | null;
      categoryName: string;
      expenseOnId: string | null;
      expenseOnName: string | null;
      sourceId: string | null;
      sourceName: string | null;
      note: string | null;
      occurredAt: string;
      via: TxVia;
      createdAt: string;
    }>;
  };
};

export type TransactionQueryVariables = Exact<{
  id: string | number;
}>;

export type TransactionQuery = {
  transaction: {
    id: string;
    type: TxType;
    amount: number;
    currency: string;
    amountBase: number;
    baseCurrency: string;
    fxRate: number;
    categoryId: string | null;
    categoryName: string;
    expenseOnId: string | null;
    expenseOnName: string | null;
    sourceId: string | null;
    sourceName: string | null;
    note: string | null;
    occurredAt: string;
    via: TxVia;
    createdAt: string;
  } | null;
};

export type ChatHistoryQueryVariables = Exact<{
  limit?: number | null | undefined;
  before?: string | null | undefined;
}>;

export type ChatHistoryQuery = {
  chatHistory: Array<{
    id: string;
    role: ChatRole;
    kind: ChatKind;
    text: string;
    selectedOptionId: string | null;
    resolved: boolean;
    createdAt: string;
    transaction: {
      id: string;
      type: TxType;
      amount: number;
      currency: string;
      amountBase: number;
      baseCurrency: string;
      fxRate: number;
      categoryId: string | null;
      categoryName: string;
      expenseOnId: string | null;
      expenseOnName: string | null;
      sourceId: string | null;
      sourceName: string | null;
      note: string | null;
      occurredAt: string;
      via: TxVia;
      createdAt: string;
    } | null;
    options: Array<{ id: string; label: string; action: string; value: string | null }>;
    report: {
      kind: ReportKind;
      title: string;
      subtitle: string;
      chartType: ChartType;
      labels: Array<string>;
      currency: string;
      from: string;
      to: string;
      empty: boolean;
      datasets: Array<{ label: string; data: Array<number>; color: string | null; colors: Array<string> | null }>;
      stats: Array<{ label: string; value: number; format: StatFormat; hint: string | null }>;
    } | null;
  }>;
};

export type ReferenceQueryVariables = Exact<{ [key: string]: never }>;

export type ReferenceQuery = { chatSuggestions: Array<string>; timeZones: Array<string>; currencies: Array<{ code: string; name: string }> };

export type EnvVarsQueryVariables = Exact<{ [key: string]: never }>;

export type EnvVarsQuery = {
  envVars: Array<{ key: string; label: string; group: string; secret: boolean; isSet: boolean; value: string | null; source: EnvSource }>;
};

export type SlackChannelsQueryVariables = Exact<{ [key: string]: never }>;

export type SlackChannelsQuery = { slackChannels: Array<{ id: string; name: string; isPrivate: boolean; isMember: boolean }> };

export type OpenAiModelsQueryVariables = Exact<{ [key: string]: never }>;

export type OpenAiModelsQuery = { openAiModels: Array<string> };

export class TypedDocumentString<TResult, TVariables> extends String implements DocumentTypeDecoration<TResult, TVariables> {
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const UserFieldsFragmentDoc = new TypedDocumentString(
  `
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
    `,
  { fragmentName: 'UserFields' },
) as unknown as TypedDocumentString<UserFieldsFragment, unknown>;
export const CategoryFieldsFragmentDoc = new TypedDocumentString(
  `
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
    `,
  { fragmentName: 'CategoryFields' },
) as unknown as TypedDocumentString<CategoryFieldsFragment, unknown>;
export const SourceFieldsFragmentDoc = new TypedDocumentString(
  `
    fragment SourceFields on PaymentSource {
  id
  name
  icon
  isDefault
}
    `,
  { fragmentName: 'SourceFields' },
) as unknown as TypedDocumentString<SourceFieldsFragment, unknown>;
export const SliceFieldsFragmentDoc = new TypedDocumentString(
  `
    fragment SliceFields on CategorySlice {
  categoryId
  name
  color
  icon
  amount
  count
  percent
}
    `,
  { fragmentName: 'SliceFields' },
) as unknown as TypedDocumentString<SliceFieldsFragment, unknown>;
export const TxFieldsFragmentDoc = new TypedDocumentString(
  `
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
    `,
  { fragmentName: 'TxFields' },
) as unknown as TypedDocumentString<TxFieldsFragment, unknown>;
export const ReportFieldsFragmentDoc = new TypedDocumentString(
  `
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
    `,
  { fragmentName: 'ReportFields' },
) as unknown as TypedDocumentString<ReportFieldsFragment, unknown>;
export const ChatFieldsFragmentDoc = new TypedDocumentString(
  `
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
}`,
  { fragmentName: 'ChatFields' },
) as unknown as TypedDocumentString<ChatFieldsFragment, unknown>;
export const EnvFieldsFragmentDoc = new TypedDocumentString(
  `
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}
    `,
  { fragmentName: 'EnvFields' },
) as unknown as TypedDocumentString<EnvFieldsFragment, unknown>;
export const SignupDocument = new TypedDocumentString(`
    mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    token
    user {
      ...UserFields
    }
  }
}
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
}`) as unknown as TypedDocumentString<SignupMutation, SignupMutationVariables>;
export const LoginDocument = new TypedDocumentString(`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      ...UserFields
    }
  }
}
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
}`) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const UpdateProfileDocument = new TypedDocumentString(`
    mutation UpdateProfile($input: ProfileInput!) {
  updateProfile(input: $input) {
    ...UserFields
  }
}
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
}`) as unknown as TypedDocumentString<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const ChangePasswordDocument = new TypedDocumentString(`
    mutation ChangePassword($current: String!, $next: String!) {
  changePassword(current: $current, next: $next)
}
    `) as unknown as TypedDocumentString<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateCategoryDocument = new TypedDocumentString(`
    mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = new TypedDocumentString(`
    mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {
  updateCategory(id: $id, input: $input) {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = new TypedDocumentString(`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const AddExpenseOnDocument = new TypedDocumentString(`
    mutation AddExpenseOn($categoryId: ID!, $name: String!) {
  addExpenseOn(categoryId: $categoryId, name: $name) {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<AddExpenseOnMutation, AddExpenseOnMutationVariables>;
export const RenameExpenseOnDocument = new TypedDocumentString(`
    mutation RenameExpenseOn($categoryId: ID!, $itemId: ID!, $name: String!) {
  renameExpenseOn(categoryId: $categoryId, itemId: $itemId, name: $name) {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<RenameExpenseOnMutation, RenameExpenseOnMutationVariables>;
export const RemoveExpenseOnDocument = new TypedDocumentString(`
    mutation RemoveExpenseOn($categoryId: ID!, $itemId: ID!) {
  removeExpenseOn(categoryId: $categoryId, itemId: $itemId) {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<RemoveExpenseOnMutation, RemoveExpenseOnMutationVariables>;
export const CreateSourceDocument = new TypedDocumentString(`
    mutation CreateSource($input: PaymentSourceInput!) {
  createPaymentSource(input: $input) {
    ...SourceFields
  }
}
    fragment SourceFields on PaymentSource {
  id
  name
  icon
  isDefault
}`) as unknown as TypedDocumentString<CreateSourceMutation, CreateSourceMutationVariables>;
export const UpdateSourceDocument = new TypedDocumentString(`
    mutation UpdateSource($id: ID!, $input: PaymentSourceInput!) {
  updatePaymentSource(id: $id, input: $input) {
    ...SourceFields
  }
}
    fragment SourceFields on PaymentSource {
  id
  name
  icon
  isDefault
}`) as unknown as TypedDocumentString<UpdateSourceMutation, UpdateSourceMutationVariables>;
export const DeleteSourceDocument = new TypedDocumentString(`
    mutation DeleteSource($id: ID!) {
  deletePaymentSource(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteSourceMutation, DeleteSourceMutationVariables>;
export const CreateTxDocument = new TypedDocumentString(`
    mutation CreateTx($input: TransactionInput!) {
  createTransaction(input: $input) {
    ...TxFields
  }
}
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
}`) as unknown as TypedDocumentString<CreateTxMutation, CreateTxMutationVariables>;
export const UpdateTxDocument = new TypedDocumentString(`
    mutation UpdateTx($id: ID!, $input: TransactionInput!) {
  updateTransaction(id: $id, input: $input) {
    ...TxFields
  }
}
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
}`) as unknown as TypedDocumentString<UpdateTxMutation, UpdateTxMutationVariables>;
export const DeleteTxDocument = new TypedDocumentString(`
    mutation DeleteTx($id: ID!) {
  deleteTransaction(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteTxMutation, DeleteTxMutationVariables>;
export const SendChatDocument = new TypedDocumentString(`
    mutation SendChat($text: String!) {
  sendChatMessage(text: $text) {
    ...ChatFields
  }
}
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
}`) as unknown as TypedDocumentString<SendChatMutation, SendChatMutationVariables>;
export const ChooseOptionDocument = new TypedDocumentString(`
    mutation ChooseOption($messageId: ID!, $optionId: ID!) {
  chooseChatOption(messageId: $messageId, optionId: $optionId) {
    ...ChatFields
  }
}
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
}`) as unknown as TypedDocumentString<ChooseOptionMutation, ChooseOptionMutationVariables>;
export const ClearChatDocument = new TypedDocumentString(`
    mutation ClearChat {
  clearChat
}
    `) as unknown as TypedDocumentString<ClearChatMutation, ClearChatMutationVariables>;
export const SetEnvVarsDocument = new TypedDocumentString(`
    mutation SetEnvVars($input: [EnvVarInput!]!) {
  setEnvVars(input: $input) {
    ...EnvFields
  }
}
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}`) as unknown as TypedDocumentString<SetEnvVarsMutation, SetEnvVarsMutationVariables>;
export const TestSlackDocument = new TypedDocumentString(`
    mutation TestSlack {
  testSlack
}
    `) as unknown as TypedDocumentString<TestSlackMutation, TestSlackMutationVariables>;
export const TestOpenAiDocument = new TypedDocumentString(`
    mutation TestOpenAi {
  testOpenAi
}
    `) as unknown as TypedDocumentString<TestOpenAiMutation, TestOpenAiMutationVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    ...UserFields
  }
}
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
}`) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const CategoriesDocument = new TypedDocumentString(`
    query Categories {
  categories {
    ...CategoryFields
  }
}
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
}`) as unknown as TypedDocumentString<CategoriesQuery, CategoriesQueryVariables>;
export const SourcesDocument = new TypedDocumentString(`
    query Sources {
  paymentSources {
    ...SourceFields
  }
}
    fragment SourceFields on PaymentSource {
  id
  name
  icon
  isDefault
}`) as unknown as TypedDocumentString<SourcesQuery, SourcesQueryVariables>;
export const DashboardDocument = new TypedDocumentString(`
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
fragment SliceFields on CategorySlice {
  categoryId
  name
  color
  icon
  amount
  count
  percent
}`) as unknown as TypedDocumentString<DashboardQuery, DashboardQueryVariables>;
export const ReportDocument = new TypedDocumentString(`
    query Report($input: ReportInput!) {
  report(input: $input) {
    ...ReportFields
  }
}
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
}`) as unknown as TypedDocumentString<ReportQuery, ReportQueryVariables>;
export const TransactionsDocument = new TypedDocumentString(`
    query Transactions($filter: TransactionFilter, $limit: Int, $offset: Int) {
  transactions(filter: $filter, limit: $limit, offset: $offset) {
    items {
      ...TxFields
    }
    total
    hasMore
  }
}
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
}`) as unknown as TypedDocumentString<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionDocument = new TypedDocumentString(`
    query Transaction($id: ID!) {
  transaction(id: $id) {
    ...TxFields
  }
}
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
}`) as unknown as TypedDocumentString<TransactionQuery, TransactionQueryVariables>;
export const ChatHistoryDocument = new TypedDocumentString(`
    query ChatHistory($limit: Int, $before: DateTime) {
  chatHistory(limit: $limit, before: $before) {
    ...ChatFields
  }
}
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
}`) as unknown as TypedDocumentString<ChatHistoryQuery, ChatHistoryQueryVariables>;
export const ReferenceDocument = new TypedDocumentString(`
    query Reference {
  chatSuggestions
  currencies {
    code
    name
  }
  timeZones
}
    `) as unknown as TypedDocumentString<ReferenceQuery, ReferenceQueryVariables>;
export const EnvVarsDocument = new TypedDocumentString(`
    query EnvVars {
  envVars {
    ...EnvFields
  }
}
    fragment EnvFields on EnvVar {
  key
  label
  group
  secret
  isSet
  value
  source
}`) as unknown as TypedDocumentString<EnvVarsQuery, EnvVarsQueryVariables>;
export const SlackChannelsDocument = new TypedDocumentString(`
    query SlackChannels {
  slackChannels {
    id
    name
    isPrivate
    isMember
  }
}
    `) as unknown as TypedDocumentString<SlackChannelsQuery, SlackChannelsQueryVariables>;
export const OpenAiModelsDocument = new TypedDocumentString(`
    query OpenAiModels {
  openAiModels
}
    `) as unknown as TypedDocumentString<OpenAiModelsQuery, OpenAiModelsQueryVariables>;
