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

export type ClientLogInput = {
  apiUrl?: string | null | undefined;
  appVersion?: string | null | undefined;
  buildNumber?: string | null | undefined;
  context?: string | null | undefined;
  device?: string | null | undefined;
  level: LogLevel;
  message: string;
  occurredAt?: string | null | undefined;
  osVersion?: string | null | undefined;
  platform?: string | null | undefined;
  /** APP or PORTAL */
  source: LogSource;
  stack?: string | null | undefined;
  url?: string | null | undefined;
};

export type EnvSource = 'APP' | 'NONE' | 'SERVER_ENV';

export type EnvVarInput = {
  key: string;
  /** Empty or null clears the value */
  value?: string | null | undefined;
};

export type LogLevel = 'ERROR' | 'FATAL' | 'INFO' | 'WARN';

export type LogSource = 'API' | 'APP' | 'PORTAL';

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
  | 'LAST_QUARTER'
  | 'LAST_WEEK'
  | 'LAST_YEAR'
  | 'THIS_MONTH'
  | 'THIS_QUARTER'
  | 'THIS_WEEK'
  | 'THIS_YEAR'
  | 'TODAY'
  | 'YESTERDAY';

export type ProfileInput = {
  /** Currency new trackers start with */
  currency?: string | null | undefined;
  locale?: string | null | undefined;
  /**
   * Sets the budget of your default tracker
   * @deprecated Use updateTracker
   */
  monthlyBudget?: number | null | undefined;
  name?: string | null | undefined;
  timezone?: string | null | undefined;
};

export type ReportFrequency =
  /** Every morning, for the day before */
  | 'DAILY'
  /** On the 1st, for the month before */
  | 'MONTHLY'
  /** On 1 Jan / Apr / Jul / Oct, for the quarter before */
  | 'QUARTERLY'
  /** On 1 January, for the year before */
  | 'YEARLY';

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

export type TicketAuthor = 'ADMIN' | 'USER';

export type TicketCategory = 'ACCOUNT' | 'BUG' | 'FEEDBACK' | 'OTHER' | 'QUESTION';

export type TicketInput = {
  category: TicketCategory;
  message: string;
  subject: string;
};

export type TicketStatus = 'CLOSED' | 'IN_PROGRESS' | 'OPEN' | 'RESOLVED';

export type TrackerInput = {
  /** ISO 4217 */
  currency: string;
  kind: TrackerKind;
  monthlyBudget?: number | null | undefined;
  name: string;
};

/** What a tracker is for; picks its starting categories and payment modes */
export type TrackerKind = 'BUSINESS' | 'PERSONAL';

/** OWNER manages the tracker and who it's shared with, EDITOR adds entries, VIEWER only reads */
export type TrackerRole = 'EDITOR' | 'OWNER' | 'VIEWER';

export type TrackerUpdateInput = {
  /** A new currency re-expresses every entry with today's rates */
  currency?: string | null | undefined;
  kind?: TrackerKind | null | undefined;
  /** null clears the budget (tracks against income) */
  monthlyBudget?: number | null | undefined;
  name?: string | null | undefined;
};

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
  /** ISO 4217, defaults to the tracker's currency */
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
  addedById: string;
  addedByName: string | null;
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
    addedById: string;
    addedByName: string | null;
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
    user: { id: string; name: string; email: string; currency: string; timezone: string; locale: string; isAdmin: boolean; createdAt: string };
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login: {
    token: string;
    user: { id: string; name: string; email: string; currency: string; timezone: string; locale: string; isAdmin: boolean; createdAt: string };
  };
};

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileInput;
}>;

export type UpdateProfileMutation = {
  updateProfile: { id: string; name: string; email: string; currency: string; timezone: string; locale: string; isAdmin: boolean; createdAt: string };
};

export type ChangePasswordMutationVariables = Exact<{
  current: string;
  next: string;
}>;

export type ChangePasswordMutation = { changePassword: boolean };

export type CreateCategoryMutationVariables = Exact<{
  trackerId?: string | number | null | undefined;
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
  trackerId?: string | number | null | undefined;
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
  trackerId?: string | number | null | undefined;
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
    addedById: string;
    addedByName: string | null;
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
    addedById: string;
    addedByName: string | null;
    createdAt: string;
  };
};

export type DeleteTxMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteTxMutation = { deleteTransaction: boolean };

export type SendChatMutationVariables = Exact<{
  trackerId?: string | number | null | undefined;
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
      addedById: string;
      addedByName: string | null;
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
      addedById: string;
      addedByName: string | null;
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

export type ClearChatMutationVariables = Exact<{
  trackerId?: string | number | null | undefined;
}>;

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
  me: { id: string; name: string; email: string; currency: string; timezone: string; locale: string; isAdmin: boolean; createdAt: string } | null;
};

export type CategoriesQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
}>;

export type CategoriesQuery = {
  categories: Array<{ id: string; name: string; type: TxType; icon: string; color: string; items: Array<{ id: string; name: string }> }>;
};

export type SourcesQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
}>;

export type SourcesQuery = { paymentSources: Array<{ id: string; name: string; icon: string; isDefault: boolean }> };

export type DashboardQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
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
      addedById: string;
      addedByName: string | null;
      createdAt: string;
    }>;
  };
};

export type ReportQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
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
  trackerId?: string | number | null | undefined;
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
      addedById: string;
      addedByName: string | null;
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
    addedById: string;
    addedByName: string | null;
    createdAt: string;
  } | null;
};

export type ChatHistoryQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
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
      addedById: string;
      addedByName: string | null;
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

export type TicketFieldsFragment = {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  messageCount: number;
  lastAuthor: TicketAuthor;
  lastMessageAt: string;
  createdAt: string;
  messages: Array<{ id: string; author: TicketAuthor; authorName: string; body: string; createdAt: string }>;
};

export type MySupportTicketsQueryVariables = Exact<{ [key: string]: never }>;

export type MySupportTicketsQuery = {
  mySupportTickets: Array<{
    id: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    messageCount: number;
    lastAuthor: TicketAuthor;
    lastMessageAt: string;
    createdAt: string;
    messages: Array<{ id: string; author: TicketAuthor; authorName: string; body: string; createdAt: string }>;
  }>;
};

export type SupportTicketQueryVariables = Exact<{
  id: string | number;
}>;

export type SupportTicketQuery = {
  supportTicket: {
    id: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    messageCount: number;
    lastAuthor: TicketAuthor;
    lastMessageAt: string;
    createdAt: string;
    messages: Array<{ id: string; author: TicketAuthor; authorName: string; body: string; createdAt: string }>;
  } | null;
};

export type CreateSupportTicketMutationVariables = Exact<{
  input: TicketInput;
}>;

export type CreateSupportTicketMutation = {
  createSupportTicket: {
    id: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    messageCount: number;
    lastAuthor: TicketAuthor;
    lastMessageAt: string;
    createdAt: string;
    messages: Array<{ id: string; author: TicketAuthor; authorName: string; body: string; createdAt: string }>;
  };
};

export type ReplySupportTicketMutationVariables = Exact<{
  id: string | number;
  body: string;
}>;

export type ReplySupportTicketMutation = {
  replySupportTicket: {
    id: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    messageCount: number;
    lastAuthor: TicketAuthor;
    lastMessageAt: string;
    createdAt: string;
    messages: Array<{ id: string; author: TicketAuthor; authorName: string; body: string; createdAt: string }>;
  };
};

export type ValidationRulesQueryVariables = Exact<{ [key: string]: never }>;

export type ValidationRulesQuery = {
  validationRules: {
    nameMax: number;
    passwordMin: number;
    passwordMax: number;
    ticketSubjectMin: number;
    ticketSubjectMax: number;
    ticketMessageMin: number;
    ticketMessageMax: number;
  };
};

export type ReportLogsMutationVariables = Exact<{
  input: Array<ClientLogInput> | ClientLogInput;
}>;

export type ReportLogsMutation = { reportLogs: number };

export type TrackerFieldsFragment = {
  id: string;
  name: string;
  kind: TrackerKind;
  currency: string;
  monthlyBudget: number | null;
  role: TrackerRole;
  isDefault: boolean;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
};

export type ScheduleFieldsFragment = { frequency: ReportFrequency; nextRunAt: string; lastSentAt: string | null; lastError: string | null };

export type TrackersQueryVariables = Exact<{ [key: string]: never }>;

export type TrackersQuery = {
  trackers: Array<{
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  }>;
};

export type CreateTrackerMutationVariables = Exact<{
  input: TrackerInput;
}>;

export type CreateTrackerMutation = {
  createTracker: {
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  };
};

export type UpdateTrackerMutationVariables = Exact<{
  id: string | number;
  input: TrackerUpdateInput;
}>;

export type UpdateTrackerMutation = {
  updateTracker: {
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  };
};

export type DeleteTrackerMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteTrackerMutation = { deleteTracker: boolean };

export type ShareTrackerMutationVariables = Exact<{
  id: string | number;
  email: string;
  role: TrackerRole;
}>;

export type ShareTrackerMutation = {
  shareTracker: {
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  };
};

export type SetTrackerMemberRoleMutationVariables = Exact<{
  id: string | number;
  userId: string | number;
  role: TrackerRole;
}>;

export type SetTrackerMemberRoleMutation = {
  setTrackerMemberRole: {
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  };
};

export type RemoveTrackerMemberMutationVariables = Exact<{
  id: string | number;
  userId: string | number;
}>;

export type RemoveTrackerMemberMutation = {
  removeTrackerMember: {
    id: string;
    name: string;
    kind: TrackerKind;
    currency: string;
    monthlyBudget: number | null;
    role: TrackerRole;
    isDefault: boolean;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    members: Array<{ role: TrackerRole; addedAt: string; user: { id: string; name: string; email: string } }>;
  };
};

export type LeaveTrackerMutationVariables = Exact<{
  id: string | number;
}>;

export type LeaveTrackerMutation = { leaveTracker: boolean };

export type EmailReportsQueryVariables = Exact<{
  trackerId?: string | number | null | undefined;
}>;

export type EmailReportsQuery = {
  emailReports: Array<{ frequency: ReportFrequency; nextRunAt: string; lastSentAt: string | null; lastError: string | null }>;
};

export type SetEmailReportsMutationVariables = Exact<{
  trackerId?: string | number | null | undefined;
  frequencies: Array<ReportFrequency> | ReportFrequency;
}>;

export type SetEmailReportsMutation = {
  setEmailReports: Array<{ frequency: ReportFrequency; nextRunAt: string; lastSentAt: string | null; lastError: string | null }>;
};

export type SendReportEmailMutationVariables = Exact<{
  trackerId?: string | number | null | undefined;
  period: Period;
}>;

export type SendReportEmailMutation = { sendReportEmail: string };

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
  addedById
  addedByName
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
  addedById
  addedByName
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
export const TicketFieldsFragmentDoc = new TypedDocumentString(
  `
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
    `,
  { fragmentName: 'TicketFields' },
) as unknown as TypedDocumentString<TicketFieldsFragment, unknown>;
export const TrackerFieldsFragmentDoc = new TypedDocumentString(
  `
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}
    `,
  { fragmentName: 'TrackerFields' },
) as unknown as TypedDocumentString<TrackerFieldsFragment, unknown>;
export const ScheduleFieldsFragmentDoc = new TypedDocumentString(
  `
    fragment ScheduleFields on EmailReportSchedule {
  frequency
  nextRunAt
  lastSentAt
  lastError
}
    `,
  { fragmentName: 'ScheduleFields' },
) as unknown as TypedDocumentString<ScheduleFieldsFragment, unknown>;
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
  isAdmin
  createdAt
}`) as unknown as TypedDocumentString<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const ChangePasswordDocument = new TypedDocumentString(`
    mutation ChangePassword($current: String!, $next: String!) {
  changePassword(current: $current, next: $next)
}
    `) as unknown as TypedDocumentString<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateCategoryDocument = new TypedDocumentString(`
    mutation CreateCategory($trackerId: ID, $input: CategoryInput!) {
  createCategory(trackerId: $trackerId, input: $input) {
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
    mutation CreateSource($trackerId: ID, $input: PaymentSourceInput!) {
  createPaymentSource(trackerId: $trackerId, input: $input) {
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
    mutation CreateTx($trackerId: ID, $input: TransactionInput!) {
  createTransaction(trackerId: $trackerId, input: $input) {
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
  addedById
  addedByName
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
  addedById
  addedByName
  createdAt
}`) as unknown as TypedDocumentString<UpdateTxMutation, UpdateTxMutationVariables>;
export const DeleteTxDocument = new TypedDocumentString(`
    mutation DeleteTx($id: ID!) {
  deleteTransaction(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteTxMutation, DeleteTxMutationVariables>;
export const SendChatDocument = new TypedDocumentString(`
    mutation SendChat($trackerId: ID, $text: String!) {
  sendChatMessage(trackerId: $trackerId, text: $text) {
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
  addedById
  addedByName
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
  addedById
  addedByName
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
    mutation ClearChat($trackerId: ID) {
  clearChat(trackerId: $trackerId)
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
  isAdmin
  createdAt
}`) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const CategoriesDocument = new TypedDocumentString(`
    query Categories($trackerId: ID) {
  categories(trackerId: $trackerId) {
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
    query Sources($trackerId: ID) {
  paymentSources(trackerId: $trackerId) {
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
  addedById
  addedByName
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
    query Report($trackerId: ID, $input: ReportInput!) {
  report(trackerId: $trackerId, input: $input) {
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
    query Transactions($trackerId: ID, $filter: TransactionFilter, $limit: Int, $offset: Int) {
  transactions(
    trackerId: $trackerId
    filter: $filter
    limit: $limit
    offset: $offset
  ) {
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
  addedById
  addedByName
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
  addedById
  addedByName
  createdAt
}`) as unknown as TypedDocumentString<TransactionQuery, TransactionQueryVariables>;
export const ChatHistoryDocument = new TypedDocumentString(`
    query ChatHistory($trackerId: ID, $limit: Int, $before: DateTime) {
  chatHistory(trackerId: $trackerId, limit: $limit, before: $before) {
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
  addedById
  addedByName
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
export const MySupportTicketsDocument = new TypedDocumentString(`
    query MySupportTickets {
  mySupportTickets {
    ...TicketFields
  }
}
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
}`) as unknown as TypedDocumentString<MySupportTicketsQuery, MySupportTicketsQueryVariables>;
export const SupportTicketDocument = new TypedDocumentString(`
    query SupportTicket($id: ID!) {
  supportTicket(id: $id) {
    ...TicketFields
  }
}
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
}`) as unknown as TypedDocumentString<SupportTicketQuery, SupportTicketQueryVariables>;
export const CreateSupportTicketDocument = new TypedDocumentString(`
    mutation CreateSupportTicket($input: TicketInput!) {
  createSupportTicket(input: $input) {
    ...TicketFields
  }
}
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
}`) as unknown as TypedDocumentString<CreateSupportTicketMutation, CreateSupportTicketMutationVariables>;
export const ReplySupportTicketDocument = new TypedDocumentString(`
    mutation ReplySupportTicket($id: ID!, $body: String!) {
  replySupportTicket(id: $id, body: $body) {
    ...TicketFields
  }
}
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
}`) as unknown as TypedDocumentString<ReplySupportTicketMutation, ReplySupportTicketMutationVariables>;
export const ValidationRulesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ValidationRulesQuery, ValidationRulesQueryVariables>;
export const ReportLogsDocument = new TypedDocumentString(`
    mutation ReportLogs($input: [ClientLogInput!]!) {
  reportLogs(input: $input)
}
    `) as unknown as TypedDocumentString<ReportLogsMutation, ReportLogsMutationVariables>;
export const TrackersDocument = new TypedDocumentString(`
    query Trackers {
  trackers {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<TrackersQuery, TrackersQueryVariables>;
export const CreateTrackerDocument = new TypedDocumentString(`
    mutation CreateTracker($input: TrackerInput!) {
  createTracker(input: $input) {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<CreateTrackerMutation, CreateTrackerMutationVariables>;
export const UpdateTrackerDocument = new TypedDocumentString(`
    mutation UpdateTracker($id: ID!, $input: TrackerUpdateInput!) {
  updateTracker(id: $id, input: $input) {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<UpdateTrackerMutation, UpdateTrackerMutationVariables>;
export const DeleteTrackerDocument = new TypedDocumentString(`
    mutation DeleteTracker($id: ID!) {
  deleteTracker(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteTrackerMutation, DeleteTrackerMutationVariables>;
export const ShareTrackerDocument = new TypedDocumentString(`
    mutation ShareTracker($id: ID!, $email: String!, $role: TrackerRole!) {
  shareTracker(id: $id, email: $email, role: $role) {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<ShareTrackerMutation, ShareTrackerMutationVariables>;
export const SetTrackerMemberRoleDocument = new TypedDocumentString(`
    mutation SetTrackerMemberRole($id: ID!, $userId: ID!, $role: TrackerRole!) {
  setTrackerMemberRole(id: $id, userId: $userId, role: $role) {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<SetTrackerMemberRoleMutation, SetTrackerMemberRoleMutationVariables>;
export const RemoveTrackerMemberDocument = new TypedDocumentString(`
    mutation RemoveTrackerMember($id: ID!, $userId: ID!) {
  removeTrackerMember(id: $id, userId: $userId) {
    ...TrackerFields
  }
}
    fragment TrackerFields on Tracker {
  id
  name
  kind
  currency
  monthlyBudget
  role
  isDefault
  owner {
    id
    name
    email
  }
  members {
    role
    addedAt
    user {
      id
      name
      email
    }
  }
  createdAt
}`) as unknown as TypedDocumentString<RemoveTrackerMemberMutation, RemoveTrackerMemberMutationVariables>;
export const LeaveTrackerDocument = new TypedDocumentString(`
    mutation LeaveTracker($id: ID!) {
  leaveTracker(id: $id)
}
    `) as unknown as TypedDocumentString<LeaveTrackerMutation, LeaveTrackerMutationVariables>;
export const EmailReportsDocument = new TypedDocumentString(`
    query EmailReports($trackerId: ID) {
  emailReports(trackerId: $trackerId) {
    ...ScheduleFields
  }
}
    fragment ScheduleFields on EmailReportSchedule {
  frequency
  nextRunAt
  lastSentAt
  lastError
}`) as unknown as TypedDocumentString<EmailReportsQuery, EmailReportsQueryVariables>;
export const SetEmailReportsDocument = new TypedDocumentString(`
    mutation SetEmailReports($trackerId: ID, $frequencies: [ReportFrequency!]!) {
  setEmailReports(trackerId: $trackerId, frequencies: $frequencies) {
    ...ScheduleFields
  }
}
    fragment ScheduleFields on EmailReportSchedule {
  frequency
  nextRunAt
  lastSentAt
  lastError
}`) as unknown as TypedDocumentString<SetEmailReportsMutation, SetEmailReportsMutationVariables>;
export const SendReportEmailDocument = new TypedDocumentString(`
    mutation SendReportEmail($trackerId: ID, $period: Period!) {
  sendReportEmail(trackerId: $trackerId, period: $period)
}
    `) as unknown as TypedDocumentString<SendReportEmailMutation, SendReportEmailMutationVariables>;
