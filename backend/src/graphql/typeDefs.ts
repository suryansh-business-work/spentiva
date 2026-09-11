export const typeDefs = /* GraphQL */ `
  "ISO 8601 date-time string in UTC, e.g. 2025-01-31T18:30:00.000Z"
  scalar DateTime

  enum TxType {
    EXPENSE
    INCOME
  }

  enum ReportKind {
    CATEGORY
    EXPENSE_ON
    SOURCE
    DAILY
    MONTHLY
    TOP
    AVERAGE
    INCOME_VS_EXPENSE
  }

  enum ChatRole {
    USER
    ASSISTANT
  }

  enum ChatKind {
    TEXT
    TRANSACTION
    OPTIONS
    REPORT
    ERROR
  }

  enum ChartType {
    bar
    barH
    line
    doughnut
    pie
  }

  enum StatFormat {
    CURRENCY
    PERCENT
    NUMBER
  }

  enum EnvSource {
    APP
    SERVER_ENV
    NONE
  }

  "Where a transaction came from"
  enum TxVia {
    CHAT
    MANUAL
  }

  "ISO 4217 currency"
  type Currency {
    code: String!
    name: String!
  }

  enum Period {
    TODAY
    YESTERDAY
    THIS_WEEK
    LAST_WEEK
    LAST_7_DAYS
    THIS_MONTH
    LAST_MONTH
    LAST_30_DAYS
    LAST_90_DAYS
    THIS_QUARTER
    LAST_QUARTER
    LAST_6_MONTHS
    LAST_12_MONTHS
    THIS_YEAR
    LAST_YEAR
    ALL_TIME
  }

  type User {
    id: ID!
    name: String!
    email: String!
    "ISO 4217 currency new trackers start with"
    currency: String!
    "IANA time zone"
    timezone: String!
    "BCP 47"
    locale: String!
    monthlyBudget: Float @deprecated(reason: "Budgets belong to trackers: use Tracker.monthlyBudget")
    isAdmin: Boolean!
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  "An 'Expense On' item inside a category"
  type ExpenseOn {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
    type: TxType!
    icon: String!
    color: String!
    items: [ExpenseOn!]!
  }

  "Expense From / payment mode"
  type PaymentSource {
    id: ID!
    name: String!
    icon: String!
    isDefault: Boolean!
  }

  type Transaction {
    id: ID!
    type: TxType!
    amount: Float!
    currency: String!
    amountBase: Float!
    baseCurrency: String!
    fxRate: Float!
    categoryId: ID
    categoryName: String!
    expenseOnId: ID
    expenseOnName: String
    sourceId: ID
    sourceName: String
    note: String
    occurredAt: DateTime!
    via: TxVia!
    "Who logged it (useful on shared trackers)"
    addedById: ID!
    addedByName: String
    createdAt: DateTime!
  }

  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    hasMore: Boolean!
  }

  type Stat {
    label: String!
    value: Float!
    format: StatFormat!
    hint: String
  }

  type Dataset {
    label: String!
    data: [Float!]!
    color: String
    colors: [String!]
  }

  type Report {
    kind: ReportKind!
    title: String!
    subtitle: String!
    chartType: ChartType!
    labels: [String!]!
    datasets: [Dataset!]!
    stats: [Stat!]!
    currency: String!
    from: DateTime!
    to: DateTime!
    empty: Boolean!
  }

  type CategorySlice {
    categoryId: ID
    name: String!
    color: String!
    icon: String!
    amount: Float!
    count: Int!
    percent: Float!
  }

  type Dashboard {
    from: DateTime!
    to: DateTime!
    currency: String!
    income: Float!
    expense: Float!
    savings: Float!
    savingsRate: Float!
    expenseRatio: Float!
    budget: Float
    remaining: Float!
    daysLeft: Int!
    dailyAllowance: Float!
    avgDailyExpense: Float!
    transactionCount: Int!
    previousExpense: Float!
    expenseChange: Float
    topCategory: CategorySlice
    categories: [CategorySlice!]!
    trend: Report!
    recent: [Transaction!]!
    insight: String!
  }

  type ChatOption {
    id: ID!
    label: String!
    action: String!
    value: String
  }

  type ChatMessage {
    id: ID!
    role: ChatRole!
    kind: ChatKind!
    text: String!
    transaction: Transaction
    options: [ChatOption!]!
    selectedOptionId: ID
    resolved: Boolean!
    report: Report
    createdAt: DateTime!
  }

  "App-wide environment setting (admins only)"
  type EnvVar {
    key: String!
    label: String!
    group: String!
    secret: Boolean!
    isSet: Boolean!
    "Masked for secrets"
    value: String
    source: EnvSource!
  }

  type SlackChannel {
    id: ID!
    name: String!
    isPrivate: Boolean!
    isMember: Boolean!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    currency: String
    timezone: String
    locale: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProfileInput {
    name: String
    "Currency new trackers start with"
    currency: String
    timezone: String
    locale: String
    "Sets the budget of your default tracker"
    monthlyBudget: Float @deprecated(reason: "Use updateTracker")
  }

  input CategoryInput {
    name: String!
    type: TxType!
    icon: String
    color: String
    items: [String!]
  }

  input CategoryUpdateInput {
    name: String
    icon: String
    color: String
  }

  input PaymentSourceInput {
    name: String!
    icon: String
    isDefault: Boolean
  }

  input TransactionInput {
    type: TxType!
    amount: Float!
    "ISO 4217, defaults to the tracker's currency"
    currency: String
    categoryId: ID!
    expenseOnId: ID
    sourceId: ID
    note: String
    occurredAt: DateTime
  }

  input TransactionFilter {
    type: TxType
    "YYYY-MM calendar month in the user's time zone"
    month: String
    from: DateTime
    to: DateTime
    categoryId: ID
    sourceId: ID
    search: String
  }

  input ReportInput {
    kind: ReportKind!
    type: TxType
    period: Period
    "YYYY-MM calendar month in the user's time zone (takes precedence over period)"
    month: String
    from: DateTime
    to: DateTime
    categoryId: ID
    limit: Int
  }

  input EnvVarInput {
    key: String!
    "Empty or null clears the value"
    value: String
  }

  """
  Everything below that takes a trackerId works on that tracker (you need access to it);
  without one it uses your default tracker.
  """
  type Query {
    me: User
    categories(trackerId: ID, type: TxType): [Category!]!
    paymentSources(trackerId: ID): [PaymentSource!]!
    transactions(trackerId: ID, filter: TransactionFilter, limit: Int, offset: Int): TransactionPage!
    transaction(id: ID!): Transaction
    "Defaults to the current month; month is YYYY-MM in the user's time zone"
    dashboard(trackerId: ID, month: String, from: DateTime, to: DateTime): Dashboard!
    report(trackerId: ID, input: ReportInput!): Report!
    "Your own conversation in that tracker"
    chatHistory(trackerId: ID, limit: Int, before: DateTime): [ChatMessage!]!
    chatSuggestions: [String!]!
    currencies: [Currency!]!
    "IANA time zone identifiers"
    timeZones: [String!]!
    envVars: [EnvVar!]!
    slackChannels: [SlackChannel!]!
    openAiModels: [String!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: ProfileInput!): User!
    changePassword(current: String!, next: String!): Boolean!

    createCategory(trackerId: ID, input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
    addExpenseOn(categoryId: ID!, name: String!): Category!
    renameExpenseOn(categoryId: ID!, itemId: ID!, name: String!): Category!
    removeExpenseOn(categoryId: ID!, itemId: ID!): Category!

    createPaymentSource(trackerId: ID, input: PaymentSourceInput!): PaymentSource!
    updatePaymentSource(id: ID!, input: PaymentSourceInput!): PaymentSource!
    deletePaymentSource(id: ID!): Boolean!

    createTransaction(trackerId: ID, input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!

    sendChatMessage(trackerId: ID, text: String!): [ChatMessage!]!
    chooseChatOption(messageId: ID!, optionId: ID!): [ChatMessage!]!
    clearChat(trackerId: ID): Boolean!

    setEnvVars(input: [EnvVarInput!]!): [EnvVar!]!
    testSlack: Boolean!
    testOpenAi: String!
    "Sends a test email to you; returns the address"
    testEmail: String!
  }
`;
