import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { ProfileInput, TypedDocumentString } from '@/gql/graphql';
import {
  AddExpenseOnMutation,
  ChangePasswordMutation,
  CreateCategoryMutation,
  CreateSourceMutation,
  CreateTxMutation,
  DeleteCategoryMutation,
  DeleteSourceMutation,
  DeleteTxMutation,
  RemoveExpenseOnMutation,
  RenameExpenseOnMutation,
  SetEnvVarsMutation,
  TestOpenAiMutation,
  TestSlackMutation,
  UpdateCategoryMutation,
  UpdateProfileMutation,
  UpdateSourceMutation,
  UpdateTxMutation,
} from '@/graphql/mutations';
import { CreateTicketMutation, ReplyTicketMutation } from '@/graphql/support';
import { gql } from '@/lib/api';
import type { TransactionInput, User } from '@/lib/types';
import { keys, useInvalidateMoney } from './keys';

/** A typed mutation that refreshes the given queries on success */
function useGqlMutation<TResult, TVariables>(document: TypedDocumentString<TResult, TVariables>, refresh: QueryKey[] = []) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables: TVariables) => gql(document, variables),
    onSuccess: () => Promise.all(refresh.map((queryKey) => qc.invalidateQueries({ queryKey }))),
  });
}

export function useSaveTransaction() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: TransactionInput }) =>
      id ? gql(UpdateTxMutation, { id, input }).then((d) => d.updateTransaction) : gql(CreateTxMutation, { input }).then((d) => d.createTransaction),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateMoney();
  return useMutation({ mutationFn: (id: string) => gql(DeleteTxMutation, { id }), onSuccess: invalidate });
}

export const useCreateCategory = () => useGqlMutation(CreateCategoryMutation, [keys.categories]);
export const useUpdateCategory = () => useGqlMutation(UpdateCategoryMutation, [keys.categories]);
export const useDeleteCategory = () => useGqlMutation(DeleteCategoryMutation, [keys.categories]);
export const useAddExpenseOn = () => useGqlMutation(AddExpenseOnMutation, [keys.categories]);
export const useRenameExpenseOn = () => useGqlMutation(RenameExpenseOnMutation, [keys.categories]);
export const useRemoveExpenseOn = () => useGqlMutation(RemoveExpenseOnMutation, [keys.categories]);

export const useCreateSource = () => useGqlMutation(CreateSourceMutation, [keys.sources]);
export const useUpdateSource = () => useGqlMutation(UpdateSourceMutation, [keys.sources]);
export const useDeleteSource = () => useGqlMutation(DeleteSourceMutation, [keys.sources]);

export const useChangePassword = () => useGqlMutation(ChangePasswordMutation);
export const useCreateTicket = () => useGqlMutation(CreateTicketMutation, [keys.tickets]);
export const useReplyTicket = () => useGqlMutation(ReplyTicketMutation, [keys.tickets, ['supportTicket']]);
export const useSaveEnvVars = () => useGqlMutation(SetEnvVarsMutation, [keys.env, keys.slack, keys.models]);
export const useTestSlack = () => useGqlMutation(TestSlackMutation);
export const useTestOpenAi = () => useGqlMutation(TestOpenAiMutation);

export function useUpdateProfile(onUser: (u: User) => void) {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (input: ProfileInput) => gql(UpdateProfileMutation, { input }).then((d) => d.updateProfile),
    onSuccess: (user) => {
      onUser(user);
      return invalidate();
    },
  });
}
