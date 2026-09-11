/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  fragment UserFields on User {\n    id\n    name\n    email\n    currency\n    timezone\n    locale\n    isAdmin\n    createdAt\n  }\n': typeof types.UserFieldsFragmentDoc;
  '\n  fragment CategoryFields on Category {\n    id\n    name\n    type\n    icon\n    color\n    items {\n      id\n      name\n    }\n  }\n': typeof types.CategoryFieldsFragmentDoc;
  '\n  fragment SourceFields on PaymentSource {\n    id\n    name\n    icon\n    isDefault\n  }\n': typeof types.SourceFieldsFragmentDoc;
  '\n  fragment TxFields on Transaction {\n    id\n    type\n    amount\n    currency\n    amountBase\n    baseCurrency\n    fxRate\n    categoryId\n    categoryName\n    expenseOnId\n    expenseOnName\n    sourceId\n    sourceName\n    note\n    occurredAt\n    via\n    addedById\n    addedByName\n    createdAt\n  }\n': typeof types.TxFieldsFragmentDoc;
  '\n  fragment ReportFields on Report {\n    kind\n    title\n    subtitle\n    chartType\n    labels\n    datasets {\n      label\n      data\n      color\n      colors\n    }\n    stats {\n      label\n      value\n      format\n      hint\n    }\n    currency\n    from\n    to\n    empty\n  }\n': typeof types.ReportFieldsFragmentDoc;
  '\n  fragment SliceFields on CategorySlice {\n    categoryId\n    name\n    color\n    icon\n    amount\n    count\n    percent\n  }\n': typeof types.SliceFieldsFragmentDoc;
  '\n  fragment ChatFields on ChatMessage {\n    id\n    role\n    kind\n    text\n    transaction {\n      ...TxFields\n    }\n    options {\n      id\n      label\n      action\n      value\n    }\n    selectedOptionId\n    resolved\n    report {\n      ...ReportFields\n    }\n    createdAt\n  }\n': typeof types.ChatFieldsFragmentDoc;
  '\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n': typeof types.EnvFieldsFragmentDoc;
  '\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n': typeof types.SignupDocument;
  '\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n': typeof types.LoginDocument;
  '\n  mutation UpdateProfile($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...UserFields\n    }\n  }\n': typeof types.UpdateProfileDocument;
  '\n  mutation ChangePassword($current: String!, $next: String!) {\n    changePassword(current: $current, next: $next)\n  }\n': typeof types.ChangePasswordDocument;
  '\n  mutation CreateCategory($trackerId: ID, $input: CategoryInput!) {\n    createCategory(trackerId: $trackerId, input: $input) {\n      ...CategoryFields\n    }\n  }\n': typeof types.CreateCategoryDocument;
  '\n  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...CategoryFields\n    }\n  }\n': typeof types.UpdateCategoryDocument;
  '\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n': typeof types.DeleteCategoryDocument;
  '\n  mutation AddExpenseOn($categoryId: ID!, $name: String!) {\n    addExpenseOn(categoryId: $categoryId, name: $name) {\n      ...CategoryFields\n    }\n  }\n': typeof types.AddExpenseOnDocument;
  '\n  mutation RenameExpenseOn($categoryId: ID!, $itemId: ID!, $name: String!) {\n    renameExpenseOn(categoryId: $categoryId, itemId: $itemId, name: $name) {\n      ...CategoryFields\n    }\n  }\n': typeof types.RenameExpenseOnDocument;
  '\n  mutation RemoveExpenseOn($categoryId: ID!, $itemId: ID!) {\n    removeExpenseOn(categoryId: $categoryId, itemId: $itemId) {\n      ...CategoryFields\n    }\n  }\n': typeof types.RemoveExpenseOnDocument;
  '\n  mutation CreateSource($trackerId: ID, $input: PaymentSourceInput!) {\n    createPaymentSource(trackerId: $trackerId, input: $input) {\n      ...SourceFields\n    }\n  }\n': typeof types.CreateSourceDocument;
  '\n  mutation UpdateSource($id: ID!, $input: PaymentSourceInput!) {\n    updatePaymentSource(id: $id, input: $input) {\n      ...SourceFields\n    }\n  }\n': typeof types.UpdateSourceDocument;
  '\n  mutation DeleteSource($id: ID!) {\n    deletePaymentSource(id: $id)\n  }\n': typeof types.DeleteSourceDocument;
  '\n  mutation CreateTx($trackerId: ID, $input: TransactionInput!) {\n    createTransaction(trackerId: $trackerId, input: $input) {\n      ...TxFields\n    }\n  }\n': typeof types.CreateTxDocument;
  '\n  mutation UpdateTx($id: ID!, $input: TransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TxFields\n    }\n  }\n': typeof types.UpdateTxDocument;
  '\n  mutation DeleteTx($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n': typeof types.DeleteTxDocument;
  '\n  mutation SendChat($trackerId: ID, $text: String!) {\n    sendChatMessage(trackerId: $trackerId, text: $text) {\n      ...ChatFields\n    }\n  }\n': typeof types.SendChatDocument;
  '\n  mutation ChooseOption($messageId: ID!, $optionId: ID!) {\n    chooseChatOption(messageId: $messageId, optionId: $optionId) {\n      ...ChatFields\n    }\n  }\n': typeof types.ChooseOptionDocument;
  '\n  mutation ClearChat($trackerId: ID) {\n    clearChat(trackerId: $trackerId)\n  }\n': typeof types.ClearChatDocument;
  '\n  mutation SetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n': typeof types.SetEnvVarsDocument;
  '\n  mutation TestSlack {\n    testSlack\n  }\n': typeof types.TestSlackDocument;
  '\n  mutation TestOpenAi {\n    testOpenAi\n  }\n': typeof types.TestOpenAiDocument;
  '\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n': typeof types.MeDocument;
  '\n  query Categories($trackerId: ID) {\n    categories(trackerId: $trackerId) {\n      ...CategoryFields\n    }\n  }\n': typeof types.CategoriesDocument;
  '\n  query Sources($trackerId: ID) {\n    paymentSources(trackerId: $trackerId) {\n      ...SourceFields\n    }\n  }\n': typeof types.SourcesDocument;
  '\n  query Dashboard($trackerId: ID, $month: String) {\n    dashboard(trackerId: $trackerId, month: $month) {\n      from\n      to\n      currency\n      income\n      expense\n      savings\n      savingsRate\n      expenseRatio\n      budget\n      remaining\n      daysLeft\n      dailyAllowance\n      avgDailyExpense\n      transactionCount\n      previousExpense\n      expenseChange\n      insight\n      topCategory {\n        ...SliceFields\n      }\n      categories {\n        ...SliceFields\n      }\n      trend {\n        ...ReportFields\n      }\n      recent {\n        ...TxFields\n      }\n    }\n  }\n': typeof types.DashboardDocument;
  '\n  query Report($trackerId: ID, $input: ReportInput!) {\n    report(trackerId: $trackerId, input: $input) {\n      ...ReportFields\n    }\n  }\n': typeof types.ReportDocument;
  '\n  query Transactions($trackerId: ID, $filter: TransactionFilter, $limit: Int, $offset: Int) {\n    transactions(trackerId: $trackerId, filter: $filter, limit: $limit, offset: $offset) {\n      items {\n        ...TxFields\n      }\n      total\n      hasMore\n    }\n  }\n': typeof types.TransactionsDocument;
  '\n  query Transaction($id: ID!) {\n    transaction(id: $id) {\n      ...TxFields\n    }\n  }\n': typeof types.TransactionDocument;
  '\n  query ChatHistory($trackerId: ID, $limit: Int, $before: DateTime) {\n    chatHistory(trackerId: $trackerId, limit: $limit, before: $before) {\n      ...ChatFields\n    }\n  }\n': typeof types.ChatHistoryDocument;
  '\n  query Reference {\n    chatSuggestions\n    currencies {\n      code\n      name\n    }\n    timeZones\n  }\n': typeof types.ReferenceDocument;
  '\n  query EnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n': typeof types.EnvVarsDocument;
  '\n  query SlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n': typeof types.SlackChannelsDocument;
  '\n  query OpenAiModels {\n    openAiModels\n  }\n': typeof types.OpenAiModelsDocument;
  '\n  fragment TicketFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    messageCount\n    lastAuthor\n    lastMessageAt\n    createdAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n': typeof types.TicketFieldsFragmentDoc;
  '\n  query MySupportTickets {\n    mySupportTickets {\n      ...TicketFields\n    }\n  }\n': typeof types.MySupportTicketsDocument;
  '\n  query SupportTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketFields\n    }\n  }\n': typeof types.SupportTicketDocument;
  '\n  mutation CreateSupportTicket($input: TicketInput!) {\n    createSupportTicket(input: $input) {\n      ...TicketFields\n    }\n  }\n': typeof types.CreateSupportTicketDocument;
  '\n  mutation ReplySupportTicket($id: ID!, $body: String!) {\n    replySupportTicket(id: $id, body: $body) {\n      ...TicketFields\n    }\n  }\n': typeof types.ReplySupportTicketDocument;
  '\n  query ValidationRules {\n    validationRules {\n      nameMax\n      passwordMin\n      passwordMax\n      ticketSubjectMin\n      ticketSubjectMax\n      ticketMessageMin\n      ticketMessageMax\n    }\n  }\n': typeof types.ValidationRulesDocument;
  '\n  mutation ReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n': typeof types.ReportLogsDocument;
  '\n  fragment TrackerFields on Tracker {\n    id\n    name\n    kind\n    currency\n    monthlyBudget\n    role\n    isDefault\n    owner {\n      id\n      name\n      email\n    }\n    members {\n      role\n      addedAt\n      user {\n        id\n        name\n        email\n      }\n    }\n    createdAt\n  }\n': typeof types.TrackerFieldsFragmentDoc;
  '\n  fragment ScheduleFields on EmailReportSchedule {\n    frequency\n    nextRunAt\n    lastSentAt\n    lastError\n  }\n': typeof types.ScheduleFieldsFragmentDoc;
  '\n  query Trackers {\n    trackers {\n      ...TrackerFields\n    }\n  }\n': typeof types.TrackersDocument;
  '\n  mutation CreateTracker($input: TrackerInput!) {\n    createTracker(input: $input) {\n      ...TrackerFields\n    }\n  }\n': typeof types.CreateTrackerDocument;
  '\n  mutation UpdateTracker($id: ID!, $input: TrackerUpdateInput!) {\n    updateTracker(id: $id, input: $input) {\n      ...TrackerFields\n    }\n  }\n': typeof types.UpdateTrackerDocument;
  '\n  mutation DeleteTracker($id: ID!) {\n    deleteTracker(id: $id)\n  }\n': typeof types.DeleteTrackerDocument;
  '\n  mutation ShareTracker($id: ID!, $email: String!, $role: TrackerRole!) {\n    shareTracker(id: $id, email: $email, role: $role) {\n      ...TrackerFields\n    }\n  }\n': typeof types.ShareTrackerDocument;
  '\n  mutation SetTrackerMemberRole($id: ID!, $userId: ID!, $role: TrackerRole!) {\n    setTrackerMemberRole(id: $id, userId: $userId, role: $role) {\n      ...TrackerFields\n    }\n  }\n': typeof types.SetTrackerMemberRoleDocument;
  '\n  mutation RemoveTrackerMember($id: ID!, $userId: ID!) {\n    removeTrackerMember(id: $id, userId: $userId) {\n      ...TrackerFields\n    }\n  }\n': typeof types.RemoveTrackerMemberDocument;
  '\n  mutation LeaveTracker($id: ID!) {\n    leaveTracker(id: $id)\n  }\n': typeof types.LeaveTrackerDocument;
  '\n  query EmailReports($trackerId: ID) {\n    emailReports(trackerId: $trackerId) {\n      ...ScheduleFields\n    }\n  }\n': typeof types.EmailReportsDocument;
  '\n  mutation SetEmailReports($trackerId: ID, $frequencies: [ReportFrequency!]!) {\n    setEmailReports(trackerId: $trackerId, frequencies: $frequencies) {\n      ...ScheduleFields\n    }\n  }\n': typeof types.SetEmailReportsDocument;
  '\n  mutation SendReportEmail($trackerId: ID, $period: Period!) {\n    sendReportEmail(trackerId: $trackerId, period: $period)\n  }\n': typeof types.SendReportEmailDocument;
};
const documents: Documents = {
  '\n  fragment UserFields on User {\n    id\n    name\n    email\n    currency\n    timezone\n    locale\n    isAdmin\n    createdAt\n  }\n':
    types.UserFieldsFragmentDoc,
  '\n  fragment CategoryFields on Category {\n    id\n    name\n    type\n    icon\n    color\n    items {\n      id\n      name\n    }\n  }\n':
    types.CategoryFieldsFragmentDoc,
  '\n  fragment SourceFields on PaymentSource {\n    id\n    name\n    icon\n    isDefault\n  }\n': types.SourceFieldsFragmentDoc,
  '\n  fragment TxFields on Transaction {\n    id\n    type\n    amount\n    currency\n    amountBase\n    baseCurrency\n    fxRate\n    categoryId\n    categoryName\n    expenseOnId\n    expenseOnName\n    sourceId\n    sourceName\n    note\n    occurredAt\n    via\n    addedById\n    addedByName\n    createdAt\n  }\n':
    types.TxFieldsFragmentDoc,
  '\n  fragment ReportFields on Report {\n    kind\n    title\n    subtitle\n    chartType\n    labels\n    datasets {\n      label\n      data\n      color\n      colors\n    }\n    stats {\n      label\n      value\n      format\n      hint\n    }\n    currency\n    from\n    to\n    empty\n  }\n':
    types.ReportFieldsFragmentDoc,
  '\n  fragment SliceFields on CategorySlice {\n    categoryId\n    name\n    color\n    icon\n    amount\n    count\n    percent\n  }\n':
    types.SliceFieldsFragmentDoc,
  '\n  fragment ChatFields on ChatMessage {\n    id\n    role\n    kind\n    text\n    transaction {\n      ...TxFields\n    }\n    options {\n      id\n      label\n      action\n      value\n    }\n    selectedOptionId\n    resolved\n    report {\n      ...ReportFields\n    }\n    createdAt\n  }\n':
    types.ChatFieldsFragmentDoc,
  '\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n':
    types.EnvFieldsFragmentDoc,
  '\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n':
    types.SignupDocument,
  '\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation UpdateProfile($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...UserFields\n    }\n  }\n':
    types.UpdateProfileDocument,
  '\n  mutation ChangePassword($current: String!, $next: String!) {\n    changePassword(current: $current, next: $next)\n  }\n':
    types.ChangePasswordDocument,
  '\n  mutation CreateCategory($trackerId: ID, $input: CategoryInput!) {\n    createCategory(trackerId: $trackerId, input: $input) {\n      ...CategoryFields\n    }\n  }\n':
    types.CreateCategoryDocument,
  '\n  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...CategoryFields\n    }\n  }\n':
    types.UpdateCategoryDocument,
  '\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n': types.DeleteCategoryDocument,
  '\n  mutation AddExpenseOn($categoryId: ID!, $name: String!) {\n    addExpenseOn(categoryId: $categoryId, name: $name) {\n      ...CategoryFields\n    }\n  }\n':
    types.AddExpenseOnDocument,
  '\n  mutation RenameExpenseOn($categoryId: ID!, $itemId: ID!, $name: String!) {\n    renameExpenseOn(categoryId: $categoryId, itemId: $itemId, name: $name) {\n      ...CategoryFields\n    }\n  }\n':
    types.RenameExpenseOnDocument,
  '\n  mutation RemoveExpenseOn($categoryId: ID!, $itemId: ID!) {\n    removeExpenseOn(categoryId: $categoryId, itemId: $itemId) {\n      ...CategoryFields\n    }\n  }\n':
    types.RemoveExpenseOnDocument,
  '\n  mutation CreateSource($trackerId: ID, $input: PaymentSourceInput!) {\n    createPaymentSource(trackerId: $trackerId, input: $input) {\n      ...SourceFields\n    }\n  }\n':
    types.CreateSourceDocument,
  '\n  mutation UpdateSource($id: ID!, $input: PaymentSourceInput!) {\n    updatePaymentSource(id: $id, input: $input) {\n      ...SourceFields\n    }\n  }\n':
    types.UpdateSourceDocument,
  '\n  mutation DeleteSource($id: ID!) {\n    deletePaymentSource(id: $id)\n  }\n': types.DeleteSourceDocument,
  '\n  mutation CreateTx($trackerId: ID, $input: TransactionInput!) {\n    createTransaction(trackerId: $trackerId, input: $input) {\n      ...TxFields\n    }\n  }\n':
    types.CreateTxDocument,
  '\n  mutation UpdateTx($id: ID!, $input: TransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TxFields\n    }\n  }\n':
    types.UpdateTxDocument,
  '\n  mutation DeleteTx($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n': types.DeleteTxDocument,
  '\n  mutation SendChat($trackerId: ID, $text: String!) {\n    sendChatMessage(trackerId: $trackerId, text: $text) {\n      ...ChatFields\n    }\n  }\n':
    types.SendChatDocument,
  '\n  mutation ChooseOption($messageId: ID!, $optionId: ID!) {\n    chooseChatOption(messageId: $messageId, optionId: $optionId) {\n      ...ChatFields\n    }\n  }\n':
    types.ChooseOptionDocument,
  '\n  mutation ClearChat($trackerId: ID) {\n    clearChat(trackerId: $trackerId)\n  }\n': types.ClearChatDocument,
  '\n  mutation SetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n': types.SetEnvVarsDocument,
  '\n  mutation TestSlack {\n    testSlack\n  }\n': types.TestSlackDocument,
  '\n  mutation TestOpenAi {\n    testOpenAi\n  }\n': types.TestOpenAiDocument,
  '\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n': types.MeDocument,
  '\n  query Categories($trackerId: ID) {\n    categories(trackerId: $trackerId) {\n      ...CategoryFields\n    }\n  }\n': types.CategoriesDocument,
  '\n  query Sources($trackerId: ID) {\n    paymentSources(trackerId: $trackerId) {\n      ...SourceFields\n    }\n  }\n': types.SourcesDocument,
  '\n  query Dashboard($trackerId: ID, $month: String) {\n    dashboard(trackerId: $trackerId, month: $month) {\n      from\n      to\n      currency\n      income\n      expense\n      savings\n      savingsRate\n      expenseRatio\n      budget\n      remaining\n      daysLeft\n      dailyAllowance\n      avgDailyExpense\n      transactionCount\n      previousExpense\n      expenseChange\n      insight\n      topCategory {\n        ...SliceFields\n      }\n      categories {\n        ...SliceFields\n      }\n      trend {\n        ...ReportFields\n      }\n      recent {\n        ...TxFields\n      }\n    }\n  }\n':
    types.DashboardDocument,
  '\n  query Report($trackerId: ID, $input: ReportInput!) {\n    report(trackerId: $trackerId, input: $input) {\n      ...ReportFields\n    }\n  }\n':
    types.ReportDocument,
  '\n  query Transactions($trackerId: ID, $filter: TransactionFilter, $limit: Int, $offset: Int) {\n    transactions(trackerId: $trackerId, filter: $filter, limit: $limit, offset: $offset) {\n      items {\n        ...TxFields\n      }\n      total\n      hasMore\n    }\n  }\n':
    types.TransactionsDocument,
  '\n  query Transaction($id: ID!) {\n    transaction(id: $id) {\n      ...TxFields\n    }\n  }\n': types.TransactionDocument,
  '\n  query ChatHistory($trackerId: ID, $limit: Int, $before: DateTime) {\n    chatHistory(trackerId: $trackerId, limit: $limit, before: $before) {\n      ...ChatFields\n    }\n  }\n':
    types.ChatHistoryDocument,
  '\n  query Reference {\n    chatSuggestions\n    currencies {\n      code\n      name\n    }\n    timeZones\n  }\n': types.ReferenceDocument,
  '\n  query EnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n': types.EnvVarsDocument,
  '\n  query SlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n': types.SlackChannelsDocument,
  '\n  query OpenAiModels {\n    openAiModels\n  }\n': types.OpenAiModelsDocument,
  '\n  fragment TicketFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    messageCount\n    lastAuthor\n    lastMessageAt\n    createdAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n':
    types.TicketFieldsFragmentDoc,
  '\n  query MySupportTickets {\n    mySupportTickets {\n      ...TicketFields\n    }\n  }\n': types.MySupportTicketsDocument,
  '\n  query SupportTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketFields\n    }\n  }\n': types.SupportTicketDocument,
  '\n  mutation CreateSupportTicket($input: TicketInput!) {\n    createSupportTicket(input: $input) {\n      ...TicketFields\n    }\n  }\n':
    types.CreateSupportTicketDocument,
  '\n  mutation ReplySupportTicket($id: ID!, $body: String!) {\n    replySupportTicket(id: $id, body: $body) {\n      ...TicketFields\n    }\n  }\n':
    types.ReplySupportTicketDocument,
  '\n  query ValidationRules {\n    validationRules {\n      nameMax\n      passwordMin\n      passwordMax\n      ticketSubjectMin\n      ticketSubjectMax\n      ticketMessageMin\n      ticketMessageMax\n    }\n  }\n':
    types.ValidationRulesDocument,
  '\n  mutation ReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n': types.ReportLogsDocument,
  '\n  fragment TrackerFields on Tracker {\n    id\n    name\n    kind\n    currency\n    monthlyBudget\n    role\n    isDefault\n    owner {\n      id\n      name\n      email\n    }\n    members {\n      role\n      addedAt\n      user {\n        id\n        name\n        email\n      }\n    }\n    createdAt\n  }\n':
    types.TrackerFieldsFragmentDoc,
  '\n  fragment ScheduleFields on EmailReportSchedule {\n    frequency\n    nextRunAt\n    lastSentAt\n    lastError\n  }\n':
    types.ScheduleFieldsFragmentDoc,
  '\n  query Trackers {\n    trackers {\n      ...TrackerFields\n    }\n  }\n': types.TrackersDocument,
  '\n  mutation CreateTracker($input: TrackerInput!) {\n    createTracker(input: $input) {\n      ...TrackerFields\n    }\n  }\n':
    types.CreateTrackerDocument,
  '\n  mutation UpdateTracker($id: ID!, $input: TrackerUpdateInput!) {\n    updateTracker(id: $id, input: $input) {\n      ...TrackerFields\n    }\n  }\n':
    types.UpdateTrackerDocument,
  '\n  mutation DeleteTracker($id: ID!) {\n    deleteTracker(id: $id)\n  }\n': types.DeleteTrackerDocument,
  '\n  mutation ShareTracker($id: ID!, $email: String!, $role: TrackerRole!) {\n    shareTracker(id: $id, email: $email, role: $role) {\n      ...TrackerFields\n    }\n  }\n':
    types.ShareTrackerDocument,
  '\n  mutation SetTrackerMemberRole($id: ID!, $userId: ID!, $role: TrackerRole!) {\n    setTrackerMemberRole(id: $id, userId: $userId, role: $role) {\n      ...TrackerFields\n    }\n  }\n':
    types.SetTrackerMemberRoleDocument,
  '\n  mutation RemoveTrackerMember($id: ID!, $userId: ID!) {\n    removeTrackerMember(id: $id, userId: $userId) {\n      ...TrackerFields\n    }\n  }\n':
    types.RemoveTrackerMemberDocument,
  '\n  mutation LeaveTracker($id: ID!) {\n    leaveTracker(id: $id)\n  }\n': types.LeaveTrackerDocument,
  '\n  query EmailReports($trackerId: ID) {\n    emailReports(trackerId: $trackerId) {\n      ...ScheduleFields\n    }\n  }\n':
    types.EmailReportsDocument,
  '\n  mutation SetEmailReports($trackerId: ID, $frequencies: [ReportFrequency!]!) {\n    setEmailReports(trackerId: $trackerId, frequencies: $frequencies) {\n      ...ScheduleFields\n    }\n  }\n':
    types.SetEmailReportsDocument,
  '\n  mutation SendReportEmail($trackerId: ID, $period: Period!) {\n    sendReportEmail(trackerId: $trackerId, period: $period)\n  }\n':
    types.SendReportEmailDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UserFields on User {\n    id\n    name\n    email\n    currency\n    timezone\n    locale\n    isAdmin\n    createdAt\n  }\n',
): typeof import('./graphql').UserFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment CategoryFields on Category {\n    id\n    name\n    type\n    icon\n    color\n    items {\n      id\n      name\n    }\n  }\n',
): typeof import('./graphql').CategoryFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SourceFields on PaymentSource {\n    id\n    name\n    icon\n    isDefault\n  }\n',
): typeof import('./graphql').SourceFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TxFields on Transaction {\n    id\n    type\n    amount\n    currency\n    amountBase\n    baseCurrency\n    fxRate\n    categoryId\n    categoryName\n    expenseOnId\n    expenseOnName\n    sourceId\n    sourceName\n    note\n    occurredAt\n    via\n    addedById\n    addedByName\n    createdAt\n  }\n',
): typeof import('./graphql').TxFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ReportFields on Report {\n    kind\n    title\n    subtitle\n    chartType\n    labels\n    datasets {\n      label\n      data\n      color\n      colors\n    }\n    stats {\n      label\n      value\n      format\n      hint\n    }\n    currency\n    from\n    to\n    empty\n  }\n',
): typeof import('./graphql').ReportFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SliceFields on CategorySlice {\n    categoryId\n    name\n    color\n    icon\n    amount\n    count\n    percent\n  }\n',
): typeof import('./graphql').SliceFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ChatFields on ChatMessage {\n    id\n    role\n    kind\n    text\n    transaction {\n      ...TxFields\n    }\n    options {\n      id\n      label\n      action\n      value\n    }\n    selectedOptionId\n    resolved\n    report {\n      ...ReportFields\n    }\n    createdAt\n  }\n',
): typeof import('./graphql').ChatFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment EnvFields on EnvVar {\n    key\n    label\n    group\n    secret\n    isSet\n    value\n    source\n  }\n',
): typeof import('./graphql').EnvFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Signup($input: SignupInput!) {\n    signup(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n',
): typeof import('./graphql').SignupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n',
): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateProfile($input: ProfileInput!) {\n    updateProfile(input: $input) {\n      ...UserFields\n    }\n  }\n',
): typeof import('./graphql').UpdateProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ChangePassword($current: String!, $next: String!) {\n    changePassword(current: $current, next: $next)\n  }\n',
): typeof import('./graphql').ChangePasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateCategory($trackerId: ID, $input: CategoryInput!) {\n    createCategory(trackerId: $trackerId, input: $input) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').CreateCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').UpdateCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n',
): typeof import('./graphql').DeleteCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AddExpenseOn($categoryId: ID!, $name: String!) {\n    addExpenseOn(categoryId: $categoryId, name: $name) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').AddExpenseOnDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RenameExpenseOn($categoryId: ID!, $itemId: ID!, $name: String!) {\n    renameExpenseOn(categoryId: $categoryId, itemId: $itemId, name: $name) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').RenameExpenseOnDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RemoveExpenseOn($categoryId: ID!, $itemId: ID!) {\n    removeExpenseOn(categoryId: $categoryId, itemId: $itemId) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').RemoveExpenseOnDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateSource($trackerId: ID, $input: PaymentSourceInput!) {\n    createPaymentSource(trackerId: $trackerId, input: $input) {\n      ...SourceFields\n    }\n  }\n',
): typeof import('./graphql').CreateSourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateSource($id: ID!, $input: PaymentSourceInput!) {\n    updatePaymentSource(id: $id, input: $input) {\n      ...SourceFields\n    }\n  }\n',
): typeof import('./graphql').UpdateSourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteSource($id: ID!) {\n    deletePaymentSource(id: $id)\n  }\n',
): typeof import('./graphql').DeleteSourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateTx($trackerId: ID, $input: TransactionInput!) {\n    createTransaction(trackerId: $trackerId, input: $input) {\n      ...TxFields\n    }\n  }\n',
): typeof import('./graphql').CreateTxDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateTx($id: ID!, $input: TransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TxFields\n    }\n  }\n',
): typeof import('./graphql').UpdateTxDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteTx($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n',
): typeof import('./graphql').DeleteTxDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SendChat($trackerId: ID, $text: String!) {\n    sendChatMessage(trackerId: $trackerId, text: $text) {\n      ...ChatFields\n    }\n  }\n',
): typeof import('./graphql').SendChatDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ChooseOption($messageId: ID!, $optionId: ID!) {\n    chooseChatOption(messageId: $messageId, optionId: $optionId) {\n      ...ChatFields\n    }\n  }\n',
): typeof import('./graphql').ChooseOptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ClearChat($trackerId: ID) {\n    clearChat(trackerId: $trackerId)\n  }\n',
): typeof import('./graphql').ClearChatDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SetEnvVars($input: [EnvVarInput!]!) {\n    setEnvVars(input: $input) {\n      ...EnvFields\n    }\n  }\n',
): typeof import('./graphql').SetEnvVarsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: '\n  mutation TestSlack {\n    testSlack\n  }\n'): typeof import('./graphql').TestSlackDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: '\n  mutation TestOpenAi {\n    testOpenAi\n  }\n'): typeof import('./graphql').TestOpenAiDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: '\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n'): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Categories($trackerId: ID) {\n    categories(trackerId: $trackerId) {\n      ...CategoryFields\n    }\n  }\n',
): typeof import('./graphql').CategoriesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Sources($trackerId: ID) {\n    paymentSources(trackerId: $trackerId) {\n      ...SourceFields\n    }\n  }\n',
): typeof import('./graphql').SourcesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Dashboard($trackerId: ID, $month: String) {\n    dashboard(trackerId: $trackerId, month: $month) {\n      from\n      to\n      currency\n      income\n      expense\n      savings\n      savingsRate\n      expenseRatio\n      budget\n      remaining\n      daysLeft\n      dailyAllowance\n      avgDailyExpense\n      transactionCount\n      previousExpense\n      expenseChange\n      insight\n      topCategory {\n        ...SliceFields\n      }\n      categories {\n        ...SliceFields\n      }\n      trend {\n        ...ReportFields\n      }\n      recent {\n        ...TxFields\n      }\n    }\n  }\n',
): typeof import('./graphql').DashboardDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Report($trackerId: ID, $input: ReportInput!) {\n    report(trackerId: $trackerId, input: $input) {\n      ...ReportFields\n    }\n  }\n',
): typeof import('./graphql').ReportDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Transactions($trackerId: ID, $filter: TransactionFilter, $limit: Int, $offset: Int) {\n    transactions(trackerId: $trackerId, filter: $filter, limit: $limit, offset: $offset) {\n      items {\n        ...TxFields\n      }\n      total\n      hasMore\n    }\n  }\n',
): typeof import('./graphql').TransactionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Transaction($id: ID!) {\n    transaction(id: $id) {\n      ...TxFields\n    }\n  }\n',
): typeof import('./graphql').TransactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ChatHistory($trackerId: ID, $limit: Int, $before: DateTime) {\n    chatHistory(trackerId: $trackerId, limit: $limit, before: $before) {\n      ...ChatFields\n    }\n  }\n',
): typeof import('./graphql').ChatHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Reference {\n    chatSuggestions\n    currencies {\n      code\n      name\n    }\n    timeZones\n  }\n',
): typeof import('./graphql').ReferenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: '\n  query EnvVars {\n    envVars {\n      ...EnvFields\n    }\n  }\n'): typeof import('./graphql').EnvVarsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SlackChannels {\n    slackChannels {\n      id\n      name\n      isPrivate\n      isMember\n    }\n  }\n',
): typeof import('./graphql').SlackChannelsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: '\n  query OpenAiModels {\n    openAiModels\n  }\n'): typeof import('./graphql').OpenAiModelsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TicketFields on SupportTicket {\n    id\n    subject\n    category\n    status\n    messageCount\n    lastAuthor\n    lastMessageAt\n    createdAt\n    messages {\n      id\n      author\n      authorName\n      body\n      createdAt\n    }\n  }\n',
): typeof import('./graphql').TicketFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MySupportTickets {\n    mySupportTickets {\n      ...TicketFields\n    }\n  }\n',
): typeof import('./graphql').MySupportTicketsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SupportTicket($id: ID!) {\n    supportTicket(id: $id) {\n      ...TicketFields\n    }\n  }\n',
): typeof import('./graphql').SupportTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateSupportTicket($input: TicketInput!) {\n    createSupportTicket(input: $input) {\n      ...TicketFields\n    }\n  }\n',
): typeof import('./graphql').CreateSupportTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ReplySupportTicket($id: ID!, $body: String!) {\n    replySupportTicket(id: $id, body: $body) {\n      ...TicketFields\n    }\n  }\n',
): typeof import('./graphql').ReplySupportTicketDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ValidationRules {\n    validationRules {\n      nameMax\n      passwordMin\n      passwordMax\n      ticketSubjectMin\n      ticketSubjectMax\n      ticketMessageMin\n      ticketMessageMax\n    }\n  }\n',
): typeof import('./graphql').ValidationRulesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ReportLogs($input: [ClientLogInput!]!) {\n    reportLogs(input: $input)\n  }\n',
): typeof import('./graphql').ReportLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TrackerFields on Tracker {\n    id\n    name\n    kind\n    currency\n    monthlyBudget\n    role\n    isDefault\n    owner {\n      id\n      name\n      email\n    }\n    members {\n      role\n      addedAt\n      user {\n        id\n        name\n        email\n      }\n    }\n    createdAt\n  }\n',
): typeof import('./graphql').TrackerFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ScheduleFields on EmailReportSchedule {\n    frequency\n    nextRunAt\n    lastSentAt\n    lastError\n  }\n',
): typeof import('./graphql').ScheduleFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Trackers {\n    trackers {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').TrackersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateTracker($input: TrackerInput!) {\n    createTracker(input: $input) {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').CreateTrackerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateTracker($id: ID!, $input: TrackerUpdateInput!) {\n    updateTracker(id: $id, input: $input) {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').UpdateTrackerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteTracker($id: ID!) {\n    deleteTracker(id: $id)\n  }\n',
): typeof import('./graphql').DeleteTrackerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ShareTracker($id: ID!, $email: String!, $role: TrackerRole!) {\n    shareTracker(id: $id, email: $email, role: $role) {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').ShareTrackerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SetTrackerMemberRole($id: ID!, $userId: ID!, $role: TrackerRole!) {\n    setTrackerMemberRole(id: $id, userId: $userId, role: $role) {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').SetTrackerMemberRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RemoveTrackerMember($id: ID!, $userId: ID!) {\n    removeTrackerMember(id: $id, userId: $userId) {\n      ...TrackerFields\n    }\n  }\n',
): typeof import('./graphql').RemoveTrackerMemberDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation LeaveTracker($id: ID!) {\n    leaveTracker(id: $id)\n  }\n',
): typeof import('./graphql').LeaveTrackerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EmailReports($trackerId: ID) {\n    emailReports(trackerId: $trackerId) {\n      ...ScheduleFields\n    }\n  }\n',
): typeof import('./graphql').EmailReportsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SetEmailReports($trackerId: ID, $frequencies: [ReportFrequency!]!) {\n    setEmailReports(trackerId: $trackerId, frequencies: $frequencies) {\n      ...ScheduleFields\n    }\n  }\n',
): typeof import('./graphql').SetEmailReportsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SendReportEmail($trackerId: ID, $period: Period!) {\n    sendReportEmail(trackerId: $trackerId, period: $period)\n  }\n',
): typeof import('./graphql').SendReportEmailDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
