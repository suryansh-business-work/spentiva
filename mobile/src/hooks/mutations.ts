import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { CategoryInput, PaymentSourceInput, ProfileInput, TypedDocumentString } from '@/gql/graphql';
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
import { SendReportEmailMutation, SetEmailReportsMutation } from '@/graphql/trackers';
import { gql } from '@/lib/api';
import type { Period, ReportFrequency, TransactionInput, User } from '@/lib/types';
import { keys, useInvalidateMoney } from './keys';
import { useTrackerId } from './queries';

/** A typed mutation that refreshes the given queries on success */
export function useGqlMutation<TResult, TVariables>(document: TypedDocumentString<TResult, TVariables>, refresh: QueryKey[] = []) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables: TVariables) => gql(document, variables),
    onSuccess: () => Promise.all(refresh.map((queryKey) => qc.invalidateQueries({ queryKey }))),
  });
}

export function useSaveTransaction() {
  const trackerId = useTrackerId();
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: TransactionInput }) =>
      id
        ? gql(UpdateTxMutation, { id, input }).then((d) => d.updateTransaction)
        : gql(CreateTxMutation, { trackerId, input }).then((d) => d.createTransaction),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateMoney();
  return useMutation({ mutationFn: (id: string) => gql(DeleteTxMutation, { id }), onSuccess: invalidate });
}

/** Category and payment-mode changes refresh the active tracker's lists */
const useCategoryMutation = <TResult, TVariables>(document: TypedDocumentString<TResult, TVariables>) =>
  useGqlMutation(document, [keys.categories(useTrackerId())]);
const useSourceMutation = <TResult, TVariables>(document: TypedDocumentString<TResult, TVariables>) =>
  useGqlMutation(document, [keys.sources(useTrackerId())]);

export function useCreateCategory() {
  const trackerId = useTrackerId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { input: CategoryInput }) => gql(CreateCategoryMutation, { ...vars, trackerId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.categories(trackerId) }),
  });
}
export const useUpdateCategory = () => useCategoryMutation(UpdateCategoryMutation);
export const useDeleteCategory = () => useCategoryMutation(DeleteCategoryMutation);
export const useAddExpenseOn = () => useCategoryMutation(AddExpenseOnMutation);
export const useRenameExpenseOn = () => useCategoryMutation(RenameExpenseOnMutation);
export const useRemoveExpenseOn = () => useCategoryMutation(RemoveExpenseOnMutation);

export function useCreateSource() {
  const trackerId = useTrackerId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { input: PaymentSourceInput }) => gql(CreateSourceMutation, { ...vars, trackerId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.sources(trackerId) }),
  });
}
export const useUpdateSource = () => useSourceMutation(UpdateSourceMutation);
export const useDeleteSource = () => useSourceMutation(DeleteSourceMutation);

/** Turns on exactly the given email reports for the active tracker */
export function useSetEmailReports() {
  const trackerId = useTrackerId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (frequencies: ReportFrequency[]) => gql(SetEmailReportsMutation, { trackerId, frequencies }).then((d) => d.setEmailReports),
    onSuccess: (schedules) => qc.setQueryData(keys.emailReports(trackerId), schedules),
  });
}

/** Emails the active tracker's report for a period now; resolves to the address it went to */
export function useSendReportEmail() {
  const trackerId = useTrackerId();
  return useMutation({ mutationFn: (period: Period) => gql(SendReportEmailMutation, { trackerId, period }).then((d) => d.sendReportEmail) });
}

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
