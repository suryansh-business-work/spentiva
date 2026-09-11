import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TrackerInput, TrackerUpdateInput } from '@/gql/graphql';
import {
  CreateTrackerMutation,
  DeleteTrackerMutation,
  LeaveTrackerMutation,
  RemoveMemberMutation,
  SetMemberRoleMutation,
  ShareTrackerMutation,
  UpdateTrackerMutation,
} from '@/graphql/trackers';
import { gql } from '@/lib/api';
import type { Tracker } from '@/lib/types';
import { keys, useInvalidateMoney } from './keys';
import { useGqlMutation } from './mutations';

/** A new tracker is added to the list right away, so it can be picked before the list reloads */
export function useCreateTracker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { input: TrackerInput }) => gql(CreateTrackerMutation, vars),
    onSuccess: ({ createTracker }) => {
      qc.setQueryData<Tracker[]>(keys.trackers, (prev) => (prev ? [...prev, createTracker] : prev));
      return qc.invalidateQueries({ queryKey: keys.trackers });
    },
  });
}

/** Sharing, removing and leaving refresh the tracker list (and with it the switcher) */
export const useDeleteTracker = () => useGqlMutation(DeleteTrackerMutation, [keys.trackers]);
export const useShareTracker = () => useGqlMutation(ShareTrackerMutation, [keys.trackers]);
export const useSetMemberRole = () => useGqlMutation(SetMemberRoleMutation, [keys.trackers]);
export const useRemoveMember = () => useGqlMutation(RemoveMemberMutation, [keys.trackers]);
export const useLeaveTracker = () => useGqlMutation(LeaveTrackerMutation, [keys.trackers]);

/** Name, kind, currency or budget: totals and budgets are recalculated too */
export function useUpdateTracker() {
  const qc = useQueryClient();
  const invalidateMoney = useInvalidateMoney();
  return useMutation({
    mutationFn: (vars: { id: string; input: TrackerUpdateInput }) => gql(UpdateTrackerMutation, vars).then((d) => d.updateTracker),
    onSuccess: () => Promise.all([qc.invalidateQueries({ queryKey: keys.trackers }), invalidateMoney()]),
  });
}
