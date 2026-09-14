import { graphql } from '@/gql';

export const SignupMutation = graphql(`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`);

export const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`);

export const UpdateProfileMutation = graphql(`
  mutation UpdateProfile($input: ProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
`);

export const ChangePasswordMutation = graphql(`
  mutation ChangePassword($current: String!, $next: String!) {
    changePassword(current: $current, next: $next)
  }
`);

export const CreateCategoryMutation = graphql(`
  mutation CreateCategory($trackerId: ID, $input: CategoryInput!) {
    createCategory(trackerId: $trackerId, input: $input) {
      ...CategoryFields
    }
  }
`);

export const UpdateCategoryMutation = graphql(`
  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
`);

export const DeleteCategoryMutation = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`);

export const AddExpenseOnMutation = graphql(`
  mutation AddExpenseOn($categoryId: ID!, $name: String!) {
    addExpenseOn(categoryId: $categoryId, name: $name) {
      ...CategoryFields
    }
  }
`);

export const RenameExpenseOnMutation = graphql(`
  mutation RenameExpenseOn($categoryId: ID!, $itemId: ID!, $name: String!) {
    renameExpenseOn(categoryId: $categoryId, itemId: $itemId, name: $name) {
      ...CategoryFields
    }
  }
`);

export const RemoveExpenseOnMutation = graphql(`
  mutation RemoveExpenseOn($categoryId: ID!, $itemId: ID!) {
    removeExpenseOn(categoryId: $categoryId, itemId: $itemId) {
      ...CategoryFields
    }
  }
`);

export const CreateSourceMutation = graphql(`
  mutation CreateSource($trackerId: ID, $input: PaymentSourceInput!) {
    createPaymentSource(trackerId: $trackerId, input: $input) {
      ...SourceFields
    }
  }
`);

export const UpdateSourceMutation = graphql(`
  mutation UpdateSource($id: ID!, $input: PaymentSourceInput!) {
    updatePaymentSource(id: $id, input: $input) {
      ...SourceFields
    }
  }
`);

export const DeleteSourceMutation = graphql(`
  mutation DeleteSource($id: ID!) {
    deletePaymentSource(id: $id)
  }
`);

export const CreateTxMutation = graphql(`
  mutation CreateTx($trackerId: ID, $input: TransactionInput!) {
    createTransaction(trackerId: $trackerId, input: $input) {
      ...TxFields
    }
  }
`);

export const UpdateTxMutation = graphql(`
  mutation UpdateTx($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TxFields
    }
  }
`);

export const DeleteTxMutation = graphql(`
  mutation DeleteTx($id: ID!) {
    deleteTransaction(id: $id)
  }
`);

export const SendChatMutation = graphql(`
  mutation SendChat($trackerId: ID, $text: String!) {
    sendChatMessage(trackerId: $trackerId, text: $text) {
      ...ChatFields
    }
  }
`);

export const ChooseOptionMutation = graphql(`
  mutation ChooseOption($messageId: ID!, $optionId: ID!) {
    chooseChatOption(messageId: $messageId, optionId: $optionId) {
      ...ChatFields
    }
  }
`);

export const ClearChatMutation = graphql(`
  mutation ClearChat($trackerId: ID) {
    clearChat(trackerId: $trackerId)
  }
`);

export const SetEnvVarsMutation = graphql(`
  mutation SetEnvVars($input: [EnvVarInput!]!) {
    setEnvVars(input: $input) {
      ...EnvFields
    }
  }
`);

export const TestSlackMutation = graphql(`
  mutation TestSlack {
    testSlack
  }
`);

export const TestOpenAiMutation = graphql(`
  mutation TestOpenAi {
    testOpenAi
  }
`);
