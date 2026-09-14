import { UpdateDisplayMutation } from '@/graphql/auth';
import { DeleteLogsMutation, ResolveLogsMutation } from '@/graphql/logs';
import { SetEnvVarsMutation, TestEmailMutation, TestOpenAiMutation, TestSlackMutation } from '@/graphql/settings';
import { ReplyTicketMutation, UpdateTicketMutation } from '@/graphql/support';
import { DeleteUserMutation, ResetPasswordMutation, UpdateUserMutation } from '@/graphql/users';
import { keys, useGqlMutation } from './gql';

export const useResolveLogs = () => useGqlMutation(ResolveLogsMutation, [keys.logs, keys.log, keys.stats]);
export const useDeleteLogs = () => useGqlMutation(DeleteLogsMutation, [keys.logs, keys.stats]);

export const useUpdateUser = () => useGqlMutation(UpdateUserMutation, [keys.users, keys.user, keys.stats]);
export const useResetPassword = () => useGqlMutation(ResetPasswordMutation);
export const useDeleteUser = () => useGqlMutation(DeleteUserMutation, [keys.users, keys.stats]);

export const useReplyTicket = () => useGqlMutation(ReplyTicketMutation, [keys.tickets, keys.ticket, keys.stats]);
export const useUpdateTicket = () => useGqlMutation(UpdateTicketMutation, [keys.tickets, keys.ticket, keys.stats]);

export const useSaveEnvVars = () => useGqlMutation(SetEnvVarsMutation, [keys.env, keys.slack, keys.models]);
export const useTestSlack = () => useGqlMutation(TestSlackMutation);
export const useTestOpenAi = () => useGqlMutation(TestOpenAiMutation);
export const useTestEmail = () => useGqlMutation(TestEmailMutation);
export const useUpdateDisplay = () => useGqlMutation(UpdateDisplayMutation);
