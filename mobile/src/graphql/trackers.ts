import { graphql } from '@/gql';

export const TrackerFields = graphql(`
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
`);

export const ScheduleFields = graphql(`
  fragment ScheduleFields on EmailReportSchedule {
    frequency
    nextRunAt
    lastSentAt
    lastError
  }
`);

export const TrackersQuery = graphql(`
  query Trackers {
    trackers {
      ...TrackerFields
    }
  }
`);

export const CreateTrackerMutation = graphql(`
  mutation CreateTracker($input: TrackerInput!) {
    createTracker(input: $input) {
      ...TrackerFields
    }
  }
`);

export const UpdateTrackerMutation = graphql(`
  mutation UpdateTracker($id: ID!, $input: TrackerUpdateInput!) {
    updateTracker(id: $id, input: $input) {
      ...TrackerFields
    }
  }
`);

export const DeleteTrackerMutation = graphql(`
  mutation DeleteTracker($id: ID!) {
    deleteTracker(id: $id)
  }
`);

export const ShareTrackerMutation = graphql(`
  mutation ShareTracker($id: ID!, $email: String!, $role: TrackerRole!) {
    shareTracker(id: $id, email: $email, role: $role) {
      ...TrackerFields
    }
  }
`);

export const SetMemberRoleMutation = graphql(`
  mutation SetTrackerMemberRole($id: ID!, $userId: ID!, $role: TrackerRole!) {
    setTrackerMemberRole(id: $id, userId: $userId, role: $role) {
      ...TrackerFields
    }
  }
`);

export const RemoveMemberMutation = graphql(`
  mutation RemoveTrackerMember($id: ID!, $userId: ID!) {
    removeTrackerMember(id: $id, userId: $userId) {
      ...TrackerFields
    }
  }
`);

export const LeaveTrackerMutation = graphql(`
  mutation LeaveTracker($id: ID!) {
    leaveTracker(id: $id)
  }
`);

export const EmailReportsQuery = graphql(`
  query EmailReports($trackerId: ID) {
    emailReports(trackerId: $trackerId) {
      ...ScheduleFields
    }
  }
`);

export const SetEmailReportsMutation = graphql(`
  mutation SetEmailReports($trackerId: ID, $frequencies: [ReportFrequency!]!) {
    setEmailReports(trackerId: $trackerId, frequencies: $frequencies) {
      ...ScheduleFields
    }
  }
`);

export const SendReportEmailMutation = graphql(`
  mutation SendReportEmail($trackerId: ID, $period: Period!) {
    sendReportEmail(trackerId: $trackerId, period: $period)
  }
`);
